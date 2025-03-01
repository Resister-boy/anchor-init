#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod anchorinit {
    use super::*;

  pub fn close(_ctx: Context<CloseAnchorinit>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.anchorinit.count = ctx.accounts.anchorinit.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.anchorinit.count = ctx.accounts.anchorinit.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeAnchorinit>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.anchorinit.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeAnchorinit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Anchorinit::INIT_SPACE,
  payer = payer
  )]
  pub anchorinit: Account<'info, Anchorinit>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseAnchorinit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub anchorinit: Account<'info, Anchorinit>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub anchorinit: Account<'info, Anchorinit>,
}

#[account]
#[derive(InitSpace)]
pub struct Anchorinit {
  count: u8,
}
