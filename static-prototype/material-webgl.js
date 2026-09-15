/* Procedural material shader for the Savoir-faire scene. Native WebGL, active only in view. */
(() => {
  const craft = document.querySelector('.craft');
  if (!craft) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width:1001px)').matches;
  if (reduce || !desktop) {
    craft.classList.add('material-webgl-fallback');
    return;
  }

  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'material-webgl.css';
  document.head.appendChild(styles);

  const canvas = document.createElement('canvas');
  canvas.className = 'craft-material-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  craft.prepend(canvas);

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    canvas.remove();
    craft.classList.add('material-webgl-fallback');
    return;
  }

  const vertexSource = `
    attribute vec2 aPosition;
    void main(){
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uProgress;

    float hash21(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
    }

    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 r = mat2(.86,-.5,.5,.86);
      for(int i=0;i<4;i++){
        v += a * noise(p);
        p = r * p * 2.03 + 7.13;
        a *= .5;
      }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 p = uv - .5;
      p.x *= uResolution.x / max(uResolution.y, 1.0);

      float drift = uProgress * 1.35;
      vec2 q = p;
      q.y += drift * .12;
      q.x += sin(q.y * 4.0 + uTime * .08) * .045;

      float warpA = fbm(q * 2.4 + vec2(uTime * .025, -drift));
      float warpB = fbm(q * 4.8 + vec2(-drift * .4, uTime * .018));
      q += vec2(warpA - .5, warpB - .5) * .095;

      float angle = .34;
      mat2 rot = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
      vec2 w = rot * q;

      float threadA = abs(sin((w.x * 26.0 + fbm(w * 3.2) * 2.4) * 3.14159));
      float threadB = abs(sin((w.y * 18.0 + fbm(w.yx * 3.8) * 1.7) * 3.14159));
      float weave = pow(1.0 - min(threadA, threadB), 3.1);
      float fibers = smoothstep(.58,.94,fbm(w * vec2(11.0,4.2) + uTime * .018));
      float relief = clamp(weave * .82 + fibers * .28 + warpA * .18, 0.0, 1.0);

      vec2 mouse = uPointer - .5;
      mouse.x *= uResolution.x / max(uResolution.y, 1.0);
      float pointerLight = exp(-3.6 * distance(p, mouse));

      float sweepX = mix(-1.1,1.2,fract(uTime * .025 + uProgress * .42));
      float sweep = exp(-8.5 * abs(p.x - sweepX - p.y * .22));

      float vignette = smoothstep(.95,.18,length(p * vec2(.76,1.05)));
      float grain = hash21(gl_FragCoord.xy + floor(uTime * 8.0)) - .5;

      vec3 deep = vec3(.075,.135,.098);
      vec3 sage = vec3(.27,.37,.285);
      vec3 fiber = vec3(.61,.58,.42);
      vec3 amber = vec3(.86,.68,.39);

      vec3 col = mix(deep, sage, relief * .72 + warpB * .14);
      col = mix(col, fiber, weave * .30);
      col += amber * pointerLight * (.10 + relief * .22);
      col += amber * sweep * (.045 + relief * .11);
      col += grain * .024;
      col *= .72 + vignette * .38;

      float alpha = clamp(.24 + relief * .5 + pointerLight * .12, 0.0, .82);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    canvas.remove();
    craft.classList.add('material-webgl-fallback');
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.remove();
    craft.classList.add('material-webgl-fallback');
    return;
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolutionLoc = gl.getUniformLocation(program, 'uResolution');
  const pointerLoc = gl.getUniformLocation(program, 'uPointer');
  const timeLoc = gl.getUniformLocation(program, 'uTime');
  const progressLoc = gl.getUniformLocation(program, 'uProgress');

  let active = false;
  let raf = 0;
  let start = performance.now();
  let targetX = .72;
  let targetY = .38;
  let pointerX = targetX;
  let pointerY = targetY;
  let width = 1;
  let height = 1;

  function resize(){
    const rect = craft.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(Math.max(rect.height, window.innerHeight) * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function sectionProgress(){
    const rect = craft.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / Math.max(1, total)));
  }

  function render(now){
    raf = 0;
    if (!active) return;

    pointerX += (targetX - pointerX) * .055;
    pointerY += (targetY - pointerY) * .055;

    gl.uniform2f(resolutionLoc, width, height);
    gl.uniform2f(pointerLoc, pointerX, 1 - pointerY);
    gl.uniform1f(timeLoc, (now - start) * .001);
    gl.uniform1f(progressLoc, sectionProgress());
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    raf = requestAnimationFrame(render);
  }

  function wake(){
    if (active) return;
    active = true;
    resize();
    craft.classList.add('is-material-active');
    start = performance.now() - 900;
    raf = requestAnimationFrame(render);
  }

  function sleep(){
    if (!active) return;
    active = false;
    craft.classList.remove('is-material-active');
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? wake() : sleep());
  }, { rootMargin: '20% 0px 20% 0px', threshold: .01 });
  observer.observe(craft);

  if (window.matchMedia('(pointer:fine)').matches) {
    craft.addEventListener('pointermove', (event) => {
      const rect = craft.getBoundingClientRect();
      targetX = Math.min(1, Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width)));
      targetY = Math.min(1, Math.max(0, (event.clientY - rect.top) / Math.max(1, rect.height)));
    }, { passive:true });
    craft.addEventListener('pointerleave', () => {
      targetX = .72;
      targetY = .38;
    }, { passive:true });
  }

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      if (active) resize();
    });
  }, { passive:true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) sleep();
    else if (craft.getBoundingClientRect().bottom > 0 && craft.getBoundingClientRect().top < innerHeight) wake();
  });

  craft.classList.add('has-material-webgl');
})();
