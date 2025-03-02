use anchor_lang::prelude::*;

declare_id!("5qrApbBfGrQMmeUjwFmj2d728J4htrFtQzBCe5mzUKaD");

mod errors;
mod instructions;
mod state;

use instructions::*;

#[program]
pub mod solfai_manager {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        ctx.accounts.initialize_config(&ctx.bumps)?;
        Ok(())
    }

    pub fn initialize_etf_token_vault(
        ctx: Context<InitializeEtfTokenVault>,
        etf_name: String,
        etf_token_symbol: String,
        etf_token_uri: String,
        description: String,
        funding_goal: u64,
    ) -> Result<()> {
        ctx.accounts.initialize_etf_token_vault(
          etf_name,
          etf_token_symbol,
          etf_token_uri,
          description,
          funding_goal,
          &ctx.bumps,
        )?;
        Ok(())
    }

    pub fn fund_etf_token(ctx: Context<FundEtfToken>) -> Result<()> {
        ctx.accounts.fund_etf_token()?;
        Ok(())
    }
}
