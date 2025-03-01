#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("5qrApbBfGrQMmeUjwFmj2d728J4htrFtQzBCe5mzUKaD");

#[program]
pub mod solfai_manager {
  use super::*;

  pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
    Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<> {
}

