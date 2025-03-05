use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::errors::*;
use crate::state::EtfTokenVault;
use crate::state::UserFunding;
use crate::state::ETF_TOKEN_VAULT_STATUS_FUNDING;
use crate::state::ETF_TOKEN_VAULT_STATUS_OPERATING;

#[derive(Accounts)]
#[instruction(etf_token_vault_id: u64)]
pub struct FundEtfToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"etf_token_vault".as_ref(),
            etf_token_vault_id.to_le_bytes().as_ref(),
        ],
        bump = etf_vault.bump,
    )]
    pub etf_vault: Account<'info, EtfTokenVault>,

    #[account(
        init,
        payer = user,
        space = 8 + UserFunding::INIT_SPACE,
        seeds = [
            b"user_funding",
            etf_token_vault_id.to_le_bytes().as_ref(),
            user.key().as_ref(),
        ],
        bump,
    )]
    pub user_funding: Account<'info, UserFunding>,

    pub system_program: Program<'info, System>,
}

impl<'info> FundEtfToken<'info> {
    pub fn fund_etf_token(
        &mut self,
        etf_token_vault_id: u64,
        fund_amount: u64,
        bumps: &FundEtfTokenBumps,
    ) -> Result<()> {
        msg!("fund etf token");

        require!(
            self.etf_vault.status == ETF_TOKEN_VAULT_STATUS_FUNDING,
            SolfaiManagerError::FundingStageEnded,
        );
        require!(
            self.etf_vault.funded_amount + fund_amount <= self.etf_vault.funding_goal,
            SolfaiManagerError::ExceedEtfVaultFundingGoal
        );

        self.etf_vault.funded_amount += fund_amount;
        self.etf_vault.funding_user_count += 1;
        self.user_funding.set_inner(UserFunding {
            etf_token_vault_id: etf_token_vault_id,
            user: self.user.key(),
            total_amount: fund_amount,
            last_updated: Clock::get()?.unix_timestamp as u64,
            claimed: false,
            minted_amount: 0,
            bump: bumps.user_funding,
        });

        // transfer sol from user account
        let cpi_context = CpiContext::new(
            self.system_program.to_account_info(),
            system_program::Transfer {
                from: self.user.to_account_info(),
                to: self.etf_vault.to_account_info(),
            },
        );

        system_program::transfer(cpi_context, fund_amount)?;

        if self.etf_vault.funded_amount == self.etf_vault.funding_goal {
            msg!("achieved funding goal!");

            self.etf_vault.status = ETF_TOKEN_VAULT_STATUS_OPERATING;
        }

        Ok(())
    }
}
