use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_lang::system_program;
use anchor_spl::associated_token;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};
use solana_program::{pubkey::Pubkey, system_instruction};

use crate::errors::*;
use crate::state::EtfTokenVault;
use crate::state::UserFunding;
use crate::state::ETF_TOKEN_VAULT_STATUS_OPERATING;
use crate::state::ETF_TOKEN_VAULT_STATUS_TERMINATED;

#[derive(Accounts)]
#[instruction(etf_token_vault_id: u64)]
pub struct SwapEtfTokenForSol<'info> {
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
    pub etf_vault: Account<'info, EtfTokenVault>, // PDA as mint authority and sol treasury

    #[account(
        mut,
        seeds = [
            b"user_funding",
            etf_token_vault_id.to_le_bytes().as_ref(),
            user.key().as_ref(),
        ],
        bump = user_funding.bump,
    )]
    pub user_funding: Account<'info, UserFunding>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = etf_vault,
    )]
    pub user_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> SwapEtfTokenForSol<'info> {
    pub fn swap_etf_token_for_sol(&mut self, etf_token_vault_id: u64) -> Result<()> {
        msg!("swap_etf_token_for_sol");

        require!(
            self.etf_vault.status == ETF_TOKEN_VAULT_STATUS_OPERATING,
            SolfaiManagerError::EtfTerminated,
        );
        require!(
            self.user_funding.claimed == true,
            SolfaiManagerError::InvalidUserFundingClaimStatus,
        );
        require!(
            self.mint.key() == self.etf_vault.etf_token_mint,
            SolfaiManagerError::InvalidMintAccount,
        );

        if self.mint.to_account_info().data_is_empty() {
            return Err(SolfaiManagerError::UninitializedMintAccount.into());
        }
        
        // burn the etf tokens
        let etf_token_vault_id_bytes = etf_token_vault_id.to_le_bytes();
        let signer_seeds: &[&[u8]] = &[
            b"etf_token_vault",
            etf_token_vault_id_bytes.as_ref(),
            &[self.etf_vault.bump],
        ];
        token::burn(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                Burn {
                    mint: self.mint.to_account_info(),
                    from: self.user_ata.to_account_info(),
                    authority: self.etf_vault.to_account_info(),
                },
                &[signer_seeds],
            ),
            self.user_funding.minted_amount,
        )?;
        msg!("Burned {} tokens", self.user_funding.minted_amount);
        
        // transfer sol from etf vault to user
        let signer_seeds: &[&[u8]] = &[
            b"etf_token_vault",
            etf_token_vault_id_bytes.as_ref(),
            &[self.etf_vault.bump],
        ];
        system_program::transfer(
            CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                system_program::Transfer {
                    from: self.user.to_account_info(),
                    to: self.etf_vault.to_account_info(),
                },
                &[signer_seeds],
            ),
            self.user_funding.total_amount,
        )?;

        // let balance = **self.etf_vault.to_account_info().lamports.borrow(); // Fetch the SOL balance
        // msg!("PDA balance: {}", balance);
        
        self.etf_vault.swapped_sol_amount += self.user_funding.total_amount;
        // msg!("ETF SOL balance: {}", self.etf_vault.funding_goal - self.etf_vault.swapped_sol_amount);
        
        if self.etf_vault.swapped_sol_amount == self.etf_vault.funding_goal {
            self.etf_vault.status = ETF_TOKEN_VAULT_STATUS_TERMINATED;
            // TODO: close pda
        }
        
        Ok(())
    }
}
