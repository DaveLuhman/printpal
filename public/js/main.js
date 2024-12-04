document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const errorMsg = document.getElementById('error-msg');  // Ensure this element exists
  if (form) {
  form.addEventListener('submit', (e) => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const modelSource = form.modelSource.value.trim();
    const primaryColor = form.primaryColor.value.trim();
    const secondaryColor = form.secondaryColor.value.trim();
    const accentColor = form.accentColor.value.trim();
    const modelFile = form.modelFile.files[0];

    let errors = [];

    if (!name) errors.push('Name is required.');
    if (!email) errors.push('Email is required.');
    if (!primaryColor) errors.push('Primary color is required.');
    if (!secondaryColor) errors.push('Secondary color is required.');
    if (!accentColor) errors.push('Accent color is required.');
    if (!modelFile && !modelSource) {
      errors.push('Either a model source link or a model file is required.');
    } else if (modelFile) {
      const allowedExtensions = ['stl', '3mf', 'step', 'obj'];
      const fileExtension = modelFile.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        errors.push('Invalid file type. Allowed types: stl, 3mf, step, obj.');
      }
    }

    if (errors.length > 0) {
      e.preventDefault();
      errorMsg.innerHTML = errors.join('<br>');
      errorMsg.style.display = 'block';
    } else {
      errorMsg.style.display = 'none';
      console.log('Form submitted successfully');
        window.location.href = '/requests/confirmation';
      }
    });
  }

  // Socket.IO client-side setup
  const socket = io();

  socket.on('statusUpdate', (data) => {
    console.log(`Received status update: ${JSON.stringify(data)}`);
    // Update the UI accordingly
    updateKanbanBoard(data);
  });

  function updateKanbanBoard(data) {
    // Logic to update the Kanban board based on the received data
    console.log(`Updating Kanban board with data: ${JSON.stringify(data)}`);
    // Example: Find the card by requestId and update its status
    const card = document.querySelector(`[data-request-id="${data.requestId}"]`);
    if (card) {
      card.querySelector('.status').textContent = data.newStatus;
      // Move the card to the appropriate lane
      const newLane = document.querySelector(`.lane[data-status="${data.newStatus}"]`);
      if (newLane) {
        newLane.appendChild(card);
      }
    }
  }

  // Tooltip logic
  const infoIcons = document.querySelectorAll('.info-icon');
  infoIcons.forEach(icon => {
    icon.addEventListener('mouseover', (e) => {
      const requestId = e.target.getAttribute('data-request-id');
      const tooltip = document.getElementById(`tooltip-${requestId}`);
      tooltip.style.display = 'block';
    });

    icon.addEventListener('mouseout', (e) => {
      const requestId = e.target.getAttribute('data-request-id');
      const tooltip = document.getElementById(`tooltip-${requestId}`);
      tooltip.style.display = 'none';
    });
  });
});