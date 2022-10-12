'reach 0.1';

const [getResult, P2_Won, Draw, P1_Won] = makeEnum(3);

const winner = (choiceA, choiceB, gChoiceA, gChoiceB) => {
    if(gChoiceA == gChoiceB)
        return Draw;
    else if(gChoiceA == (choiceA + choiceB)) {
        return P1_Won;
    } else if(gChoiceB == (choiceA + choiceB)) {
        return P2_Won;
    } else
        return Draw;
};

//assert
assert(winner(0, 4, 0, 4) == P2_Won);
assert(winner(4, 0, 4, 0) == P1_Won);
assert(winner(0, 1, 0, 4) == Draw);
assert(winner(4, 4, 4, 4) == Draw);

forall(UInt, a =>
    forall(UInt, b =>
        forall(UInt, c =>
            forall(UInt, d =>
                assert(getResult(winner(a, b, c, d)))
            )
        )
    )
);

forall(UInt, a =>
    forall(UInt, b =>
        forall(UInt, c =>
            assert(winner(a, b, c, c) == Draw)
        )
    )
);

//data definition
const Shared = {
    ...hasRandom,
    getChoice: Fun([], UInt),
    getGuess: Fun([], UInt),
    getResult: Fun([UInt], Null),
    showTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
    const Player1 = Participant('Player1', {
        ...Shared,
        wager: UInt,
        deadline: UInt,
    });

    const Player2 = Participant('Player2', {
        ...Shared,
        acceptWager: Fun([UInt], Null),
    });
    init();

    //the program

    const showTimeout = () => {
        each([Player1, Player2], () => {
            interact.showTimeout();
        });
    };

    Player1.only(() => {
        const amt = declassify(interact.wager);
        const time = declassify(interact.deadline);
    });

    Player1.publish(amt, time)
        .pay(amt);
    commit();

    Player2.interact.acceptWager(amt);
    Player2.pay(amt)
        .timeout(relativeTime(time), () => closeTo(Player1, showTimeout));

    var result = Draw;
    invariant(balance() == 2 * amt && getResult(result));

    while (result == Draw) {
        commit();



        Player1.only(() => {
            const _choiceA = interact.getChoice();
            const _gChoiceA = interact.getGuess();

            const [_commitA, _saltA] = makeCommitment(interact, _choiceA);
            const commitA = declassify(_commitA);

            const [_gCommitA, _gSaltA] = makeCommitment(interact, _gChoiceA);
            const gCommitA = declassify(_gCommitA);
        });

        Player1.publish(commitA, gCommitA)
            .timeout(relativeTime(time), () => closeTo(Player2, showTimeout));
        commit();

        unknowable(Player2, Player1(_choiceA, _saltA));
        unknowable(Player2, Player1(_gChoiceA, _gSaltA));

        Player2.only(() => {
            const _choiceB = interact.getChoice();
            const _gChoiceB = interact.getGuess();
            const choiceB = declassify(_choiceB);
            const gChoiceB = declassify(_gChoiceB);
        });

        Player2.publish(choiceB, gChoiceB)
            .timeout(relativeTime(time), () => closeTo(Player1, showTimeout));
        commit();

        Player1.only(() => {
            const [saltA, choiceA] = declassify([_saltA, _choiceA]);
            const [gSaltA, gChoiceA] = declassify([_gSaltA, _gChoiceA]);
        })

        Player1.publish(saltA, choiceA, gSaltA, gChoiceA)
            .timeout(relativeTime(time), () => closeTo(Player2, showTimeout));

        checkCommitment(commitA, saltA, choiceA);
        checkCommitment(gCommitA, gSaltA, gChoiceA);

        //require continue and to update the variables

        result = winner(choiceA, choiceB, gChoiceA, gChoiceB);
        continue;
    }
    //while ended here

    assert(result == P1_Won || result == P2_Won);
    transfer(2 * amt).to(result == P1_Won ? Player1 : Player2);
    commit();

    each([Player1, Player2], () => {
        interact.getResult(result);
    });

    exit();

});