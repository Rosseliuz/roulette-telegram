const items = [
    "image/star.png",
    "image/flower.png",
    "image/coin.png",
    "image/mshroom.png",
    "image/chomp.png",
];

const probabilities = [
    0.1,
    0.2,
    0.4,
    0.2,
    0.1,
];

class Roulette {

    constructor() {
        this.SIZE = 128;
        this.LENGTH = 80;
        this.DURATION = 5000;

        this.progress = 0;

        this.startTime = 0;
        this.lastItem = 0;

        this.level = 0;

        this.roulette = document.getElementById("roulette");
        this.items = this.roulette.children;
        this.isMobile = window.innerWidth < 600;
        this.direction = this.isMobile ? "vertical" : "horizontal";
         this.resultElement = document.getElementById("roulette-result");
    }

    init(images) {
        if (!Array.isArray(images)) {
            console.log("You need to pass images as an array!");
        }

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        for (let i = 0; i < 6; i++) {
            const item = this.items[i];

             item.style.position = 'absolute';
           if (this.isMobile) {
                item.style.transform = `translateY(${i * this.SIZE}px)`;
            } else {
                item.style.transform = `translateX(${i * this.SIZE}px)`;
            }
            item.lastChild.src = this.getItem();

        }
    }

    getRandomItem() {
        let rand = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (rand < cumulativeProbability) {
                return i;
            }
        }
        return 0;
    }

    start() {
        this.level = 0;
        this.progress = 0;
        this.lastItem = this.getRandomItem();
        this.startTime = Date.now();

        for (let i = 0; i < 6; i++) {
            this.items[i].value = 0;
        }

         // Скрываем предыдущее сообщение
        this.resultElement.style.display = "block";
	this.resultElement.style.color = "white";

        window.requestAnimationFrame(() => this.update());
    }

    update() {
        this.progress = (Date.now() - this.startTime) / this.DURATION;

        if (this.progress > 1) {
            this.progress = 1;
            this.render();
            this.showResult(); // Показываем результат
            return;
        }

        this.render();

        window.requestAnimationFrame(() => this.update());
    }


   render() {
        const off = this.interpolator(this.progress) * this.SIZE * this.LENGTH;
        const WIDTH = this.SIZE * 6;
        for (let i = 0; i < 6; i++) {
            const item = this.items[i];
            let base, index, value;
            if (this.direction === "vertical") {
                base = (i + 1) * this.SIZE - off;
                index = -Math.floor(base / WIDTH);
                value = ((base % WIDTH) + WIDTH) % WIDTH - this.SIZE;
                item.style.transform = `translateY(${value}px)`;
            } else {
                base = (i + 1) * this.SIZE - off;
                index = -Math.floor(base / WIDTH);
                value = ((base % WIDTH) + WIDTH) % WIDTH - this.SIZE;
                item.style.transform = `translateX(${value}px)`;

            }

            if (item.value != index) {
                this.level += index - item.value;

                item.value = index;
                item.lastChild.src = this.getItem();

                if (this.level == this.LENGTH - 3) {
                    item.lastChild.src = this.getItem(this.lastItem);
                }
            }
        }
    }


    showResult() {
      const itemName = items[this.lastItem].split('/').pop().split('.')[0]; // получаем имя картинки
         this.resultElement.textContent = `Вы выиграли: ${itemName}!`;
        this.resultElement.style.display = "block"; // Показываем сообщение
	this.resultElement.style.color = "black";

    }

    interpolator(val) {
        return Math.pow(Math.sin(val * Math.PI / 2), 2.6);
    }

    getItem(val) {
        val = typeof val !== "undefined" ? val : Math.floor(Math.random() * items.length);
        return items[val];
    }
}


const roulette = new Roulette();
roulette.init(items);

const btnStart = document.getElementById("roulette-start");
btnStart.onclick = () => roulette.start();