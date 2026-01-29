// Initialize data
let userData = {
    points: 0,
    streak: 0,
    badges: 0,
    level: 1,
    title: 'Eco Newbie',
    devices: [],
    totalCO2: 0,
    totalEnergy: 0,
    totalLandfill: 0,
    totalTrees: 0
};

const badges = [
    { id: 1, name: 'First Steps', icon: '🌱', requirement: 1, unlocked: false },
    { id: 2, name: 'Eco Warrior', icon: '⚔️', requirement: 5, unlocked: false },
    { id: 3, name: 'Green Guardian', icon: '🛡️', requirement: 10, unlocked: false },
    { id: 4, name: 'Planet Protector', icon: '🌍', requirement: 25, unlocked: false },
    { id: 5, name: 'Gold Digger', icon: '💰', requirement: 50, unlocked: false }
];

const leaderboardData = [
    { name: 'EcoWarrior101', points: 2340 },
    { name: 'GreenTechie', points: 2100 },
    { name: 'You', points: 0, isUser: true },
    { name: 'RecycleKing', points: 1850 },
    { name: 'PlanetSaver', points: 1720 }
];

// Material estimation based on device type
const deviceMaterials = {
    smartphone: { gold: 0.034, copper: 15, lithium: 2, plastic: 40, co2: 3, energy: 8, landfill: 0.15, value: 2.50, points: 150 },
    laptop: { gold: 0.2, copper: 250, lithium: 8, plastic: 500, co2: 15, energy: 35, landfill: 2.5, value: 12.50, points: 400 },
    tablet: { gold: 0.05, copper: 25, lithium: 3, plastic: 80, co2: 5, energy: 12, landfill: 0.4, value: 4.00, points: 200 },
    desktop: { gold: 0.3, copper: 500, lithium: 0, plastic: 1200, co2: 25, energy: 55, landfill: 5, value: 18.00, points: 500 },
    monitor: { gold: 0.01, copper: 50, lithium: 0, plastic: 800, co2: 12, energy: 20, landfill: 3, value: 5.00, points: 250 },
    keyboard: { gold: 0.005, copper: 20, lithium: 0, plastic: 200, co2: 2, energy: 4, landfill: 0.5, value: 1.00, points: 50 },
    mouse: { gold: 0.002, copper: 10, lithium: 0, plastic: 50, co2: 1, energy: 2, landfill: 0.1, value: 0.50, points: 30 },
    headphones: { gold: 0.003, copper: 15, lithium: 1, plastic: 80, co2: 1.5, energy: 3, landfill: 0.15, value: 0.75, points: 40 },
    charger: { gold: 0.001, copper: 25, lithium: 0, plastic: 40, co2: 1, energy: 2, landfill: 0.1, value: 0.50, points: 25 },
    other: { gold: 0.01, copper: 20, lithium: 1, plastic: 100, co2: 2, energy: 5, landfill: 0.3, value: 1.50, points: 75 }
};

// Generate tracking ID
function generateTrackingId() {
    return 'TR2T-' + Math.floor(Math.random() * 9000 + 1000);
}

// Submit device
function submitDevice(event) {
    event.preventDefault();
    
    const type = document.getElementById('deviceType').value;
    const brand = document.getElementById('brand').value;
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;

    const materials = deviceMaterials[type];
    const trackingId = generateTrackingId();
    
    // Determine action
    const action = (condition === 'excellent' || condition === 'good') && parseInt(age) < 3 ? 'Refurbish' : 'Recycle';
    
    // Create device object
    const device = {
        id: trackingId,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        brand,
        age,
        condition,
        action,
        materials,
        value: materials.value,
        points: materials.points,
        status: 'Submitted',
        progress: 25,
        date: new Date().toLocaleDateString()
    };

    // Add to user devices
    userData.devices.unshift(device);
    
    // Update user stats
    userData.points += materials.points;
    userData.totalCO2 += materials.co2;
    userData.totalEnergy += materials.energy;
    userData.totalLandfill += materials.landfill;
    userData.totalTrees = Math.floor(userData.totalCO2 / 20);

    // Update level and title
    updateLevel();
    
    // Update badges
    updateBadges();
    
    // Update challenge progress
    updateChallengeProgress();

    // Show result with animation
    showDeviceResult(device);
    
    // Update displays
    updateDashboard();
    
    // Show success notification
    showNotification('🎉 Device submitted successfully!', 'success');
    
    // Reset form
    document.getElementById('deviceForm').reset();
}

function showDeviceResult(device) {
    const resultHTML = `
        <div class="result-box">
            <h3 style="margin-bottom: 1rem; color: white; font-size: 1.1rem;">✅ Device Submitted Successfully!</h3>
            <div class="result-item">
                <strong>Tracking ID:</strong>
                <span class="device-id">${device.id}</span>
            </div>
            <div class="result-item">
                <strong>Action:</strong>
                <span>${device.action === 'Recycle' ? '♻️' : '🔄'} ${device.action}</span>
            </div>
            <div class="result-item">
                <strong>Value:</strong>
                <span>$${device.value.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <strong>Points:</strong>
                <span>⭐ ${device.points} points</span>
            </div>
            <div class="result-item">
                <strong>CO₂ Saved:</strong>
                <span>💨 ${device.materials.co2} kg</span>
            </div>
        </div>
    `;
    document.getElementById('deviceResult').innerHTML = resultHTML;
    
    setTimeout(() => {
        const resultBox = document.querySelector('.result-box');
        if (resultBox) {
            resultBox.style.opacity = '0';
            setTimeout(() => {
                document.getElementById('deviceResult').innerHTML = '';
            }, 300);
        }
    }, 5000);
}

function updateLevel() {
    const pointsThresholds = [0, 500, 1200, 2500, 5000, 10000];
    const titles = ['Eco Newbie', 'Green Starter', 'Eco Warrior', 'Green Guardian', 'Eco Champion', 'Planet Hero'];
    
    for (let i = pointsThresholds.length - 1; i >= 0; i--) {
        if (userData.points >= pointsThresholds[i]) {
            const oldLevel = userData.level;
            userData.level = i + 1;
            userData.title = titles[i];
            
            // Show level up notification
            if (oldLevel < userData.level) {
                showNotification(`🎊 Level Up! You're now a ${userData.title}!`, 'success');
            }
            
            // Update progress bar
            const nextThreshold = pointsThresholds[i + 1] || 10000;
            const progress = ((userData.points - pointsThresholds[i]) / (nextThreshold - pointsThresholds[i])) * 100;
            document.getElementById('levelProgress').style.width = Math.min(progress, 100) + '%';
            break;
        }
    }
}

function updateBadges() {
    const deviceCount = userData.devices.length;
    badges.forEach(badge => {
        if (deviceCount >= badge.requirement && !badge.unlocked) {
            badge.unlocked = true;
            userData.badges++;
            showBadgeUnlockAnimation(badge);
        }
    });
    renderBadges();
}

function showBadgeUnlockAnimation(badge) {
    showNotification(`🏆 Badge Unlocked: ${badge.name} ${badge.icon}`, 'success');
}

function updateChallengeProgress() {
    const count = Math.min(userData.devices.length, 5);
    const percentage = (count / 5) * 100;
    
    document.getElementById('challengeCount').textContent = count;
    document.getElementById('challengePercentage').textContent = Math.round(percentage) + '%';
    
    // Update circular progress
    const circle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    if (count === 5) {
        userData.points += 500;
        showNotification('🎉 Challenge Completed! +500 bonus points!', 'success');
        updateDashboard();
    }
}

function updateDashboard() {
    // Animate number changes
    animateValue('userStreak', parseInt(document.getElementById('userStreak').textContent), userData.streak);
    animateValue('userPoints', parseInt(document.getElementById('userPoints').textContent.replace(/,/g, '')), userData.points);
    animateValue('userBadges', parseInt(document.getElementById('userBadges').textContent), userData.badges);
    animateValue('deviceCount', parseInt(document.getElementById('deviceCount').textContent), userData.devices.length);
    
    document.getElementById('userLevel').textContent = userData.level;
    document.getElementById('userTitle').textContent = userData.title;

    // Update impact values
    document.getElementById('impactTrees').textContent = userData.totalTrees;
    document.getElementById('impactCO2').textContent = userData.totalCO2.toFixed(1) + 'kg';
    document.getElementById('impactEnergy').textContent = userData.totalEnergy.toFixed(1) + 'kWh';
    document.getElementById('impactLandfill').textContent = userData.totalLandfill.toFixed(2) + 'kg';

    // Update leaderboard
    leaderboardData[2].points = userData.points;
    leaderboardData.sort((a, b) => b.points - a.points);
    renderLeaderboard();

    // Render devices
    renderDevices();
}

function animateValue(id, start, end, duration = 1000) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

function renderDevices() {
    const deviceList = document.getElementById('deviceList');
    
    if (userData.devices.length === 0) {
        deviceList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No devices yet. Add your first device above!</p>
            </div>
        `;
        return;
    }

    deviceList.innerHTML = userData.devices.map((device, index) => `
        <div class="device-item" style="animation-delay: ${index * 0.1}s">
            <div class="device-header">
                <div>
                    <strong style="color: white; font-size: 1.1rem;">${device.type}</strong> - <span style="color: rgba(255,255,255,0.8);">${device.brand}</span>
                    <br>
                    <span class="device-id">${device.id}</span>
                </div>
                <span class="status-badge status-${device.status.toLowerCase()}">${device.status}</span>
            </div>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem;">
                ${device.action} • ${device.points} pts • $${device.value} • ${device.date}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${device.progress}%"></div>
            </div>
        </div>
    `).join('');
}

function renderBadges() {
    const container = document.getElementById('badgeContainer');
    container.innerHTML = badges.map((badge, index) => `
        <div class="badge ${badge.unlocked ? '' : 'locked'}" style="animation-delay: ${index * 0.1}s">
            ${badge.icon}
            <div class="badge-tooltip">${badge.name}</div>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = leaderboardData.slice(0, 5).map((user, index) => {
        const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1);
        return `
            <div class="leaderboard-item ${user.isUser ? 'user-rank' : ''}" style="animation-delay: ${index * 0.1}s">
                <div class="leaderboard-rank">${rank}</div>
                <div class="leaderboard-name">${user.name}${user.isUser ? ' 🎯' : ''}</div>
                <div class="leaderboard-points">${user.points.toLocaleString()} pts</div>
            </div>
        `;
    }).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        backdrop-filter: blur(10px);
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Scroll to form function
function scrollToForm() {
    document.getElementById('deviceForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderBadges();
    renderLeaderboard();
    renderDevices();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add gradient for circular progress
    const svg = document.querySelector('.progress-ring');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#34d399" />
    `;
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
});

// Simulate device status updates
setInterval(() => {
    let updated = false;
    userData.devices.forEach(device => {
        if (device.progress < 100) {
            device.progress += 5;
            if (device.progress >= 50 && device.status === 'Submitted') {
                device.status = 'Processing';
                updated = true;
            } else if (device.progress >= 100) {
                device.status = 'Completed';
                device.progress = 100;
                updated = true;
            }
        }
    });
    if (updated) {
        renderDevices();
    }
}, 3000);