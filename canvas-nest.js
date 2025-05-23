(function () {
  function CanvasNest(canvas, config) {
    this.canvas = canvas || document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.config = Object.assign({
      color: '0,0,0',
      pointColor: '0,0,0',
      opacity: 0.5,
      zIndex: -1,
      count: 99,
      colorArray: null // 新增：允许传颜色数组
    }, config);

    this.particles = [];
    this.mouse = { x: null, y: null };
    this.init();
  }

  CanvasNest.prototype.init = function () {
    const canvas = this.canvas;
    const context = this.context;
    const config = this.config;
    const colorArray = config.colorArray;

    canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${config.zIndex};opacity:${config.opacity};`;
    document.body.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < config.count; i++) {
      const color = colorArray ? colorArray[i % colorArray.length] : config.color;
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5),
        vy: (Math.random() - 0.5),
        color: color
      });
    }

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.animate();
  };

  CanvasNest.prototype.animate = function () {
    const context = this.context;
    const particles = this.particles;
    const config = this.config;
    const mouse = this.mouse;
    const canvas = this.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // 移动
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // 绘制点
      context.beginPath();
      context.fillStyle = `rgba(${p.color},${config.opacity})`;
      context.arc(p.x, p.y, 1.5, 0, Math.PI * 2, true);
      context.fill();

      // 连线
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = dx * dx + dy * dy;
        if (dist < 6000) {
          context.beginPath();
          context.strokeStyle = `rgba(${p.color},${config.opacity})`;
          context.moveTo(p.x, p.y);
          context.lineTo(q.x, q.y);
          context.stroke();
        }
      }

      // 鼠标连线
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = dx * dx + dy * dy;
        if (dist < 10000) {
          context.beginPath();
          context.strokeStyle = `rgba(${p.color},${config.opacity})`;
          context.moveTo(p.x, p.y);
          context.lineTo(mouse.x, mouse.y);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(this.animate.bind(this));
  };

  window.CanvasNest = CanvasNest;
})();
