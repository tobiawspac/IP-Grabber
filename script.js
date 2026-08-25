function getBrowser(ua){
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\//.test(ua)) return 'Opera'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Unknown'
}

function getOS(ua){
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11'
  if (/Windows/.test(ua)) return 'Windows (older)'
  const android = ua.match(/Android ([\d.]+)/)
  if (android) return 'Android ' + android[1]
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/CrOS/.test(ua)) return 'ChromeOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}

function getDeviceType(ua){
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile / tablet'
  if (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 800) return 'Mobile / tablet'
  return 'Desktop'
}

async function getBattery(){
  if (!navigator.getBattery) return 'unavailable'
  try{
    const b = await navigator.getBattery()
    return Math.round(b.level * 100) + '%' + (b.charging ? ' (charging)' : '')
  }catch(e){ return 'unavailable' }
}

async function getPublicIp(){
  try{
    const res = await fetch('https://api.ipify.org?format=json')
    return (await res.json()).ip
  }catch(e){ return 'unavailable' }
}

document.getElementById('btn-reveal').addEventListener('click', async () => {
  document.getElementById('tool-gate').style.display = 'none'
  const root = document.getElementById('tool-root')
  root.classList.add('unlocked')
  root.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const ua = navigator.userAgent
  document.getElementById('v-time').textContent = new Date().toLocaleString()
  document.getElementById('v-tz').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone
  document.getElementById('v-device').textContent = getDeviceType(ua)
  document.getElementById('v-os').textContent = getOS(ua)
  document.getElementById('v-browser').textContent = getBrowser(ua)

  getBattery().then(v => { document.getElementById('v-battery').textContent = v })
  getPublicIp().then(v => { document.getElementById('v-ip').textContent = v })
})
