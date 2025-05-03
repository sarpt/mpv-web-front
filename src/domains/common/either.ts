type Either<TA, TB> = {
  match: <RTA, RTB>(whenA: (val: TA) => RTA, whenB: (val: TB) => RTB) => RTA | RTB,
  takeA: (err?: Error) => TA,
  takeB: (err?: Error) => TB,
};

type side = 'a' | 'b';
function makeEither<TA, TB>(side: side, val: TA | TB): Either<TA, TB> {
  return {
    match: <RTA, RTB>(whenA: (val: TA) => RTA, whenB: (val: TB) => RTB): RTA | RTB => {
      return side === 'a' ? whenA(val as TA) : whenB(val as TB);
    },
    takeA: (err?: Error) => { 
      if (side !== 'a') {
        throw err ?? new Error('either expected "A" but it contains "B"');
      }

      return val as TA;
    },
    takeB: (err?: Error) => { 
      if (side !== 'b') {
        throw err ?? new Error('either expected "B" but it contains "A"');
      }

      return val as TB;
    },
  };
} 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeA<TA, TB = any>(val: TA): Either<TA, TB> {
  return makeEither<TA, TB>('a', val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeB<TB, TA = any>(val: TB): Either<TA, TB> {
  return makeEither<TA, TB>('b', val);
}

export type Result<TR, TE = Error> = {
  match: <RTR, RTE>(whenResult: (val: TR) => RTR, whenErr: (val: TE) => RTE) => RTR | RTE,
  ok: (err?: Error) => TR,
  okOrDefault: (defValue: TR) => TR,
  err: (err: Error) => TE,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeOk<TR>(val: TR): Result<TR, any> {
  const either = makeA(val);
  return wrapEitherAsResult(either);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeErr<TE>(err: TE): Result<any, TE> {
  const either = makeB(err);
  return wrapEitherAsResult(either);
}

const wrapEitherAsResult = <TR, TE>(either: Either<TR, TE>): Result<TR, TE> => {
  return {
    match: either.match,
    ok: (err?: Error) => {
      return either.match(
        (val) => {
          return val;
        },
        (b) => {
          if (err) { throw err } else { throw new Error(`"ok" was expected but result contains an error: ${b}`)};
        }
      );
    },
    okOrDefault: (defValue: TR): TR => {
      return either.match((val) => {
        return val;
      }, () => {
        return defValue;
      });
    },
    err: (err?: Error) => {
      return either.match(
        () => {
          if (err) { throw err } else { throw new Error('"err" expected but Result is "ok"') };
        },
        (b) => {
          return b;
        }
      );
    }
  };
}
