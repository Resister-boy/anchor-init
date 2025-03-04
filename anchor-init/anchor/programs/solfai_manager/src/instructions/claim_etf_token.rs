use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::{self, Create};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::*;
use crate::state::EtfTokenVault;
use crate::state::UserFunding;
use crate::state::ETF_TOKEN_VAULT_STATUS_OPERATING;

#[derive(Accounts)]
#[instruction(etf_token_vault_id: u64)]
pub struct ClaimEtfToken<'info> {
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
    pub etf_vault: Account<'info, EtfTokenVault>, // PDA as mint authority

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
    pub mint: Account<'info, Mint>, // ETF Token mint

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = etf_vault, // PDA owns the ATA
    )]
    pub user_ata: Account<'info, TokenAccount>,

    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> ClaimEtfToken<'info> {
    pub fn claim_etf_token(&mut self, etf_token_vault_id: u64) -> Result<()> {
        msg!("claim_etf_token");

        require!(
            self.etf_vault.status == ETF_TOKEN_VAULT_STATUS_OPERATING,
            SolfaiManagerError::ClaimStageEnded,
        );
        require!(
            self.user_funding.claimed == false,
            SolfaiManagerError::AlreadyClaimed,
        );
        require!(
            self.etf_vault.funded_amount >= self.user_funding.total_amount,
            SolfaiManagerError::SufficientFundedAmount,
        );
        require!(
            self.mint.key() == self.etf_vault.etf_token_mint,
            SolfaiManagerError::InvalidMintAccount,
        );

        self.mint_etf_tokens(etf_token_vault_id)?;

        self.user_funding.claimed = true;
        self.etf_vault.funded_amount -= self.user_funding.total_amount;

        Ok(())
    }

    pub fn mint_etf_tokens(&self, etf_token_vault_id: u64) -> Result<()> {
        if self.mint.to_account_info().data_is_empty() {
            return Err(SolfaiManagerError::UninitializedMintAccount.into());
        }

        let etf_token_vault_id_bytes = etf_token_vault_id.to_le_bytes();
        let signer_seeds: &[&[u8]] = &[
            b"etf_token_vault",
            etf_token_vault_id_bytes.as_ref(),
            &[self.etf_vault.bump],
        ];

        token::mint_to(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                token::MintTo {
                    mint: self.mint.to_account_info(),
                    to: self.user_ata.to_account_info(),
                    authority: self.etf_vault.to_account_info(),
                },
                &[signer_seeds],
            ),
            self.user_funding.total_amount / 1000 * 2, // TODO: change amount of tokens to mint
        )?;

        Ok(())
    }
}
