// SAJÁT BEÉPÍTETT DINÓ JÁTÉK LOGIKA (TÖBB KAKTUSSZAL)
        const canvas = document.getElementById("dinoCanvas");
        const ctx = canvas.getContext("2d");

        // Képek betöltése
        const dinoImg = new Image();
        dinoImg.src = 'dino.png';

        const cactusImg = new Image();
        cactusImg.src = 'cactus.png';

        let dino = { x: 50, y: 100, width: 40, height: 40, yVelocity: 0, jumpPower: -10, gravity: 0.6, grounded: true };
        
        // Akadály objektum módosítva: mostantól egy csoportot (csoportméretet) is tárol
        let obstacle = { 
            x: 600, 
            y: 100, 
            width: 30, 
            height: 50, 
            speed: 5, 
            count: 1 // Hány kaktusz van egymás mellett (1-3)
        };

        let score = 0;
        let isGameOver = false;
        let isImagesLoaded = false;

        dinoImg.onload = () => { isImagesLoaded = true; loop(); };

        document.addEventListener("keydown", function(e) {
            if (e.code === "Space" && !isGameOver) {
                e.preventDefault();
                jump();
            } else if (e.code === "Space" && isGameOver) {
                resetGame();
            }
        });

        canvas.addEventListener("click", function() {
            if (!isGameOver) {
                jump();
            } else {
                resetGame();
            }
        });

        function jump() {
            if (dino.grounded) {
                dino.yVelocity = dino.jumpPower;
                dino.grounded = false;
            }
        }

        function resetGame() {
            score = 0;
            obstacle.x = 600;
            obstacle.speed = 5;
            obstacle.count = 1;
            dino.y = 100;
            dino.yVelocity = 0;
            isGameOver = false;
            loop();
        }

        function update() {
            if (isGameOver) return;

            // Dínó fizika
            dino.yVelocity += dino.gravity;
            dino.y += dino.yVelocity;

            if (dino.y >= 100) {
                dino.y = 100;
                dino.grounded = true;
                dino.yVelocity = 0;
            }

            // Akadályok mozgása
            obstacle.x -= obstacle.speed;
            
            // Ha a kaktuszcsoport kimegy balra, újat generálunk 1 és 3 között
            let totalGroupWidth = obstacle.width * obstacle.count + (obstacle.count - 1) * 5;
            if (obstacle.x < -totalGroupWidth) {
                obstacle.x = 600 + Math.random() * 200;
                obstacle.count = Math.floor(Math.random() * 3) + 1; // Véletlenszám 1 és 3 között
                score++;
                if (score % 3 === 0) obstacle.speed += 0.4; // Fokozatos gyorsulás
            }

            // Teljes csoport szélessége az ütközésvizsgálathoz (kaktuszok + köztük lévő kis rés)
            let currentGroupWidth = obstacle.width * obstacle.count + (obstacle.count - 1) * 5;

            // Ütközésvizsgálat a teljes kaktuszcsoportra
            if (
                dino.x < obstacle.x + currentGroupWidth * 0.8 &&
                dino.x + dino.width * 0.8 > obstacle.x &&
                dino.y < obstacle.y + obstacle.height * 0.8 &&
                dino.y + dino.height * 0.8 > obstacle.y
            ) {
                isGameOver = true;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Talaj vonal
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 145);
            ctx.lineTo(600, 145);
            ctx.stroke();

            if (isImagesLoaded) {
                // Dínó kirajzolása
                ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

                // Egymás melletti kaktuszok kirajzolása a darabszám (obstacle.count) alapján
                for (let i = 0; i < obstacle.count; i++) {
                    let cactusX = obstacle.x + (i * (obstacle.width - 3)); // 5 pixel hely van a kaktuszok között
                    ctx.drawImage(cactusImg, cactusX, obstacle.y, obstacle.width, obstacle.height);
                }
            } else {
                ctx.fillStyle = "#38bdf8";
                ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
                ctx.fillStyle = "#f43f5e";
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }

            // Pontszám
            ctx.fillStyle = "#f8fafc";
            ctx.font = "16px Inter, sans-serif";
            ctx.fillText("Pont: " + score, 20, 30);

            if (isGameOver) {
                ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = "#f8fafc";
                ctx.font = "bold 20px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Vége a játéknak!", canvas.width / 2, 70);
                
                ctx.font = "14px Inter, sans-serif";
                ctx.fillStyle = "#38bdf8";
                ctx.fillText("Kattints vagy nyomj Space-t az újrakezdéshez", canvas.width / 2, 105);
                ctx.textAlign = "left";
            }
        }

        function loop() {
            update();
            draw();
            if (!isGameOver) {
                requestAnimationFrame(loop);
            }
        }