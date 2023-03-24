const rotations = [
    [360, 180, 270],
    [360, 360, 360],
    [360, 0/**/, 180],
    [270, 90, 360],
    [360, 360, 90],
    [90, 270, 0/**/],
]

let lastRotation = [ 0, 0, 0 ]


document.querySelector(`.side-5`).classList.add("side-dark")
document.querySelector(`.side-6`).classList.add("side-dark")

let btn = document.querySelector(".start-anim");
btn.addEventListener("click", () => {
    btn.disabled = true;

    let currentRotation = [ ...lastRotation ]

    const dice_container = document.querySelector(".dice-container")
    const dice = document.querySelector(".dice")

    let sideIndex = Math.floor(Math.random() * rotations.length);
    let targetRotation = rotations[sideIndex];
    let startRotation = [...currentRotation]
    let deltaRotation = targetRotation.map((v, i) => Math.abs(startRotation[i] - v))
    deltaRotation = deltaRotation.map(v => v < 360 ? v + 360 : v)
    deltaRotation = deltaRotation.map(v => v + 360)

    console.log("starting anim", sideIndex + 1);

    let translateY = 0;
    const setTransform = () => {
        dice.style.transform = `rotateY(${currentRotation[1]}deg) rotateX(${currentRotation[0]}deg) rotateZ(${currentRotation[2]}deg)`
        dice_container.style.transform = `translateY(${translateY}rem) rotateX(-30deg) rotateY(50deg)`
    }
    

    const shakeDice = new mojs.Tween({
        duration: 3000,
        easing: "ease.out",
        onStart (isForward, isYoyo) {
            for (let i = 1; i <= 6; i++) {
                document.querySelector(`.side-${i}`).classList.remove("side-dark")
            }
        },
        onUpdate (ep, p, isForward, isYoyo) {
            currentRotation = startRotation.map((v, i) => v + Math.floor(deltaRotation[i] * ep))
            setTransform();
        },
        onComplete (isForward, isYoyo) {
            lastRotation = currentRotation.map(v => v % 360)
            for (let i = 1; i <= 6; i++) {
                if (i - 1 == sideIndex) continue;
                document.querySelector(`.side-${i}`).classList.add("side-dark")
            }
            liftDice.playBackward()
        },
    })

    const liftDice = new mojs.Tween({
        duration: 400,
        easing: "quad.in",
        onUpdate (ep, p, isForward, isYoyo) {
            translateY = ep * -4;
            setTransform();
        },
        onComplete (isForward, isYoyo) {
            if (isForward)
                shakeDice.play();
            else {
                btn.disabled = false;
            }
        },
    });

    liftDice.play()

})