use anchor_lang::prelude::*;

use crate::state::ProgramState;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + ProgramState::INIT_SPACE,
        seeds = [b"program_state".as_ref()],
        bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeConfig<'info> {
    pub fn initialize_config(&mut self, bumps: &InitializeConfigBumps) -> Result<()> {
        msg!("initialize config");

        self.program_state.set_inner(ProgramState {
            admin: self.admin.key(),
            etf_token_count: 0,
            bump: bumps.program_state,
        });

        Ok(())
    }
}