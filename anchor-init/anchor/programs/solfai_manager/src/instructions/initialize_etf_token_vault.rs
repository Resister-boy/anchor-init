use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token},
};

use crate::errors::SolfaiManagerError;
use crate::state::ProgramState;
use crate::state::EtfTokenVault;
use crate::state::EtfTokenMetadata;
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

    #[account(
        init,
        payer = creator,
        seeds = [
            b"etf_token_mint",
            (program_state.etf_token_count + 1).to_le_bytes().as_ref(),
        ],
        bump,
        mint::decimals = 6,
        mint::authority = etf_vault,
        // mint::freeze_authority = etf_vault,
    )]
    pub etf_token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        space = 8 + EtfTokenMetadata::INIT_SPACE,
        seeds = [
            b"etf_token_metadata",
            etf_token_mint.key().as_ref(),
        ],
        bump,
    )]
    pub etf_token_metadata: Account<'info, EtfTokenMetadata>,

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
        etf_token_symbol: String,
        etf_token_uri: String,
        description: String,
        funding_goal: u64,
        bumps: &InitializeEtfTokenVaultBumps,
    ) -> Result<()> {
        let funding_start_time = Clock::get()?.unix_timestamp;

        if funding_goal < FUNDING_MINIMUM {
            return Err(SolfaiManagerError::InvalidEtfVaultFundingGoal.into());
        };

        msg!("creating metadata accounts");
        self.etf_token_metadata.set_inner(EtfTokenMetadata {
            symbol: etf_token_symbol,
            uri: etf_token_uri,
            mint: self.etf_token_mint.key(),
        });
        
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
        Ok(())
    }
}
