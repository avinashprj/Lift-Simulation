let floorContainer = document.querySelectorAll(".floor-container");
const form = document.getElementById("elevator-form");
let floors = 0;
let elevators = 0;
let showElevatorUI = false;

const addElevator = () => {
    floorContainer = document.querySelectorAll(".floor-container");
    const baseElevatorContainer = floorContainer[
        floorContainer.length - 1
    ].querySelector(".floor-elevator-container");

    const newElevator = document.createElement("div");
    newElevator.classList.add("elevator");
    newElevator.innerHTML = `
      <div class="elevator-left"></div>
      <div class="elevator-right"></div>
      `;
    baseElevatorContainer.appendChild(newElevator);
};

const addFloor = (index) => {
    const elevatorContainer = document.querySelector(".elevator-container");
    const firstChildElevator = document.querySelector(
        ".floor-container:first-child"
    );
    const floorContainerNode = document.createElement("div");

    floorContainerNode.classList.add("floor-container");
    floorContainerNode.setAttribute("data-floor", index);
    floorContainerNode.innerHTML = `
        <div class="floor-buttons">
            <button class="btn up-btn" data-button-floor=${index}>Down</button>
        </div>
        <div class="floor-elevator-container">
        </div>
    `;

    elevatorContainer.insertBefore(floorContainerNode, firstChildElevator);

    if (floors > 1) {
        const secondFloorContainer = document.querySelector(
            `.floor-container:nth-child(2)`
        );
        const floorButtons =
            secondFloorContainer.querySelector(".floor-buttons");
        floorButtons.innerHTML = `
            <button class="btn up-btn" data-button-floor=${
                index - 1
            }>Up</button>
            <button class="btn down-btn" data-button-floor=${
                index - 1
            }>Down</button>`;
    }

    const floorContainer = document.querySelectorAll(".floor-container");
    floorContainer.forEach((floor) => {
        floor.addEventListener("click", callElevator);
    });
};

function callElevator(event) {
    const target = event.target;

    if (target.classList.contains("btn")) {
        const btnFloor = target.dataset.buttonFloor;
        moveElevatorToFloor(btnFloor);
    }
}

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const toggleElevatorDoors = async (elevator) => {
    elevator.classList.add("open");
    await delay(2500);
    elevator.classList.remove("open");
    elevator.classList.add("close");
    await delay(2500);
    elevator.classList.remove("close");
    elevator.classList.remove("busy");
};

const openElevatorDoors = async (elevator, time = 0) => {
    if (elevator.classList.contains("busy")) {
        return;
    }
    elevator.classList.add("busy");

    if (time === 0) {
        toggleElevatorDoors(elevator);
        return;
    }
    await delay(time * 1000);
    toggleElevatorDoors(elevator);
};

const moveElevatorToFloor = async (destFloor) => {
    const elevatorsEl = document.querySelectorAll(".elevator");

    for (let i = 0; i < elevatorsEl.length; i++) {
        const currentElevator = elevatorsEl[i];

        if (!currentElevator.classList.contains("busy")) {
            const elevatorFloor =
                currentElevator.getAttribute("data-current-floor");
            const top = parseInt(currentElevator.style.top);

            const floorDifference = destFloor - elevatorFloor;
            const direction = floorDifference > 0 ? 1 : -1;
            const time = Math.abs(floorDifference) * 2;
            const newTop = -172 * floorDifference + (top || 0);

            currentElevator.style.top = `${newTop}px`;
            currentElevator.style.transitionDuration = time + "s";
            currentElevator.setAttribute("data-current-floor", destFloor);

            await openElevatorDoors(currentElevator, time);
            return;
        }
    }
};

floorContainer.forEach((floor) =>
    floor.addEventListener("click", callElevator)
);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const elevatorContainer = document.querySelector(".elevator-container");
    const elevatorForm = document.querySelector(".elevator-form");
    elevatorContainer.classList.remove("hidden");
    elevatorForm.classList.add("hidden");
    const formElement = event.target;
    const floorInputValue = formElement.querySelector("#floor-input").value;
    const elevatorInputValue =
        formElement.querySelector("#elevator-input").value;
    elevators = parseInt(elevatorInputValue);
    floors = parseInt(floorInputValue);
    for (let i = 0; i < elevators; i++) {
        addElevator();
    }
    for (let i = 1; i <= floors; i++) {
        addFloor(i);
    }
});
