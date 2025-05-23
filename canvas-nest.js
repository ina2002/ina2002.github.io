(function () {
    const config = {
        color: '255,0,0',
        opacity: 0.5,
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

    const particles = [];
    for (let i = 0; i < config.count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5
        });
    }

    const mouse = { x: null, y: null };
    document.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 6000) {
                    context.beginPath();
                    context.strokeStyle = `rgba(${config.color},${config.opacity})`;
                    context.lineWidth = 0.5;
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(particles[j].x, particles[j].y);
                    context.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = dx * dx + dy * dy;
                if (dist < 10000) {
                    context.beginPath();
                    context.strokeStyle = `rgba(${config.color},${config.opacity})`;
                    context.lineWidth = 0.8;
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(mouse.x, mouse.y);
                    context.stroke();
                    particles[i].x += dx * -0.01;
                    particles[i].y += dy * -0.01;
                }
            }
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            context.beginPath();
            context.fillStyle = `rgba(${config.color},${config.opacity})`;
            context.arc(p.x, p.y, 1.5, 0, Math.PI * 2, true);
            context.fill();
        }

        requestAnimationFrame(draw);
    }

    draw();
})();
