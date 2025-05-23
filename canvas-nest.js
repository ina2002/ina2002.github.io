(function () {
    const config = {
        opacity: 0.7,
        count: 100
    };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r},${g},${b},${config.opacity})`;
    }

    const particles = [];
    for (let i = 0; i < config.count; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            color: randomColor()
        });
    }

    const mouse = { x: null, y: null };
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // 连线
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = dx * dx + dy * dy;
                if (dist < 6000) {
                    context.beginPath();
                    context.strokeStyle = p1.color;
                    context.moveTo(p1.x, p1.y);
                    context.lineTo(p2.x, p2.y);
                    context.stroke();
                }
            }

            // 鼠标吸引
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p1.x;
                const dy = mouse.y - p1.y;
                const dist = dx * dx + dy * dy;
                if (dist < 10000) {
                    context.beginPath();
                    context.strokeStyle = p1.color;
                    context.moveTo(p1.x, p1.y);
                    context.lineTo(mouse.x, mouse.y);
                    context.stroke();

                    const pull = 0.02;
                    p1.vx += dx * pull / 100;
                    p1.vy += dy * pull / 100;
                }
            }

            // 更新位置
            p1.x += p1.vx;
            p1.y += p1.vy;

            // 边界反弹
            if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

            // 绘制点
            context.beginPath();
            context.fillStyle = p1.color;
            context.arc(p1.x, p1.y, 1.5, 0, Math.PI * 2);
            context.fill();
        }

        requestAnimationFrame(draw);
    }

    draw();
})();
