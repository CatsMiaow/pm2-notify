// https://gist.github.com/bag-man/5570809

const os = require('os');

function getInfo() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    totalTick += cpu.times.user;
    totalTick += cpu.times.nice;
    totalTick += cpu.times.sys;
    totalTick += cpu.times.irq;
    totalTick += cpu.times.idle;

    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;

  return { idle, total };
}

function monitor() {
  const start = getInfo();

  setInterval(() => {
    const end = getInfo();

    const idle = end.idle - start.idle;
    const total = end.total - start.total;
    const percent = 1 - (idle / total);

    console.log(`${(percent * 100).toFixed(2)}%`);
  }, 1000);
}

monitor();
