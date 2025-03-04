use anchor_lang::prelude::*;
use anchor_spl::token::Token;
use anchor_spl::token::SetAuthority;
use anchor_spl::token;

use crate::errors::SolfaiManagerError;
use crate::state::EtfTokenVault;
use crate::state::ProgramState;

use crate::state::ETF_TOKEN_VAULT_STATUS_FUNDING;
use crate::state::FUNDING_MINIMUM;

#[derive(Accounts)]
pub struct InitializeEtfTokenVault<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + EtfTokenVault::INIT_SPACE,
        seeds = [
            b"etf_token_vault".as_ref(),
            (program_state.etf_token_count + 1).to_le_bytes().as_ref(),
         ],
        bump,
    )]
    pub etf_vault: Account<'info, EtfTokenVault>,

    #[account(mut)]
    /// CHECK: this is created by frontend
    pub etf_token_mint: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"program_state".as_ref()],
        bump = program_state.bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeEtfTokenVault<'info> {
    pub fn initialize_etf_token_vault(
        &mut self,
        etf_name: String,
        description: String,
        funding_goal: u64,
        bumps: &InitializeEtfTokenVaultBumps,
    ) -> Result<()> {
        let funding_start_time = Clock::get()?.unix_timestamp;

        if funding_goal < FUNDING_MINIMUM {
            return Err(SolfaiManagerError::InvalidEtfVaultFundingGoal.into());
        };

        msg!("initialize etf token vault");
        self.etf_vault.set_inner(EtfTokenVault {
            id: self.program_state.etf_token_count + 1,
            creator: self.creator.key(),
            etf_name,
            etf_token_mint: self.etf_token_mint.key(),
            description,
            funded_amount: 0,
            funding_goal,
            funding_start_time: funding_start_time as u64,
            funding_user_count: 0,
            status: ETF_TOKEN_VAULT_STATUS_FUNDING,
            bump: bumps.etf_vault,
        });

        msg!("set mint authority from creator");
        let cpi_accounts = SetAuthority {
            current_authority: self.creator.to_account_info(),
            account_or_mint: self.etf_token_mint.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        
        token::set_authority(
            cpi_ctx,
            token::spl_token::instruction::AuthorityType::MintTokens,
            Some(self.etf_vault.key()), // Set to new authority
        )?;
        
        Ok(())
    }
}
