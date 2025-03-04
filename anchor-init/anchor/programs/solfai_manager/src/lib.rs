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
        description: String,
        funding_goal: u64,
    ) -> Result<()> {
        ctx.accounts
            .initialize_etf_token_vault(etf_name, description, funding_goal, &ctx.bumps)?;
        Ok(())
    }

    pub fn fund_etf_token(
        ctx: Context<FundEtfToken>,
        etf_token_vault_id: u64,
        fund_amount: u64,
    ) -> Result<()> {
        ctx.accounts
            .fund_etf_token(etf_token_vault_id, fund_amount, &ctx.bumps)?;
        Ok(())
    }

    pub fn claim_etf_token(ctx: Context<ClaimEtfToken>, etf_token_vault_id: u64) -> Result<()> {
        ctx.accounts.claim_etf_token(etf_token_vault_id)?;
        Ok(())
    }
}
