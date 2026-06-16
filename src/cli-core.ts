import { getAge } from './age';
import { maskNIC } from './mask';
import { safeParse } from './parse';
import { validateNIC } from './validate';

export type CliResult = {
  code: number;
  stdout: string;
  stderr: string;
};

const USAGE = `lanka-nic — Sri Lankan NIC utility

Usage:
  lanka-nic validate <nic>
  lanka-nic parse <nic>
  lanka-nic mask <nic>
  lanka-nic age <nic>

If <nic> is omitted, the value is read from stdin.
`;

const ok = (stdout: string): CliResult => ({ code: 0, stdout, stderr: '' });
const err = (code: number, stderr: string): CliResult => ({
  code,
  stdout: '',
  stderr
});

export const runCommand = (
  argv: string[],
  stdinValue: string | null
): CliResult => {
  const cmd = argv[0];
  const arg = argv[1];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    return ok(USAGE);
  }

  const trimmedStdin = stdinValue?.trim() ?? '';
  const nic = arg ?? (trimmedStdin || null);
  if (nic === null) {
    return err(2, USAGE);
  }

  switch (cmd) {
    case 'validate': {
      const valid = validateNIC(nic);
      return { code: valid ? 0 : 1, stdout: `${valid}\n`, stderr: '' };
    }
    case 'parse': {
      const result = safeParse(nic);
      if (result.success) {
        return ok(`${JSON.stringify(result.data, null, 2)}\n`);
      }
      const payload = JSON.stringify({
        error: result.error.code,
        message: result.error.message
      });
      return err(1, `${payload}\n`);
    }
    case 'mask': {
      const masked = maskNIC(nic);
      const valid = validateNIC(nic);
      return { code: valid ? 0 : 1, stdout: `${masked}\n`, stderr: '' };
    }
    case 'age': {
      const age = getAge(nic);
      if (age === null) {
        return err(1, 'invalid nic\n');
      }
      return ok(`${age}\n`);
    }
    default:
      return err(2, `unknown command: ${cmd}\n${USAGE}`);
  }
};
