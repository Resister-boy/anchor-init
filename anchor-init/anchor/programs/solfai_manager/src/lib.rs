use anchor_lang::prelude::*;

declare_id!("5qrApbBfGrQMmeUjwFmj2d728J4htrFtQzBCe5mzUKaD");

mod errors;
mod instructions;

use instructions::*;

#[program]
pub mod solfai_manager {
  use super::*;

  pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
    ctx.accounts.initialize_config()?;
    Ok(())
  }

  pub fn initialize_etf_token_vault(ctx: Context<InitializeEtfTokenVault>) -> Result<()> {
    ctx.accounts.initialize_etf_token_vault()?;
    Ok(())
  }

  pub fn fund_etf_token(ctx: Context<FundEtfToken>) -> Result<()> {
    ctx.accounts.fund_etf_token()?;
    Ok(())
  }
}
