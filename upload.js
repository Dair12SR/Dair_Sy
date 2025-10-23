(function() {
  'use strict';

  const SUPABASE_URL = 'https://xunaogemagmuzkrbtplr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bmFvZ2VtYWdtdXprcmJ0cGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODU1MTEsImV4cCI6MjA3Njc2MTUxMX0.8WCAchH3pjnqb0E-4RotY-sYagkQptZ1Ty642qIge2Y';
  
  let supabaseClient;

  document.addEventListener('DOMContentLoaded', initUploadModule);

  function initUploadModule() {
    console.log('📸 Módulo de subida inicializado');
    
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Cliente de Supabase conectado');
    } else {
      console.error('❌ Supabase no está cargado');
      return;
    }

    createUploadModal();
    
    const fileInput = document.getElementById('upload-photo-input');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileSelect);
    }
  }

  function createUploadModal() {
    if (document.getElementById('upload-photo-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'upload-photo-modal';
    modal.className = 'upload-modal';
    modal.innerHTML = `
      <div class="upload-modal-content">
        <h2>📸 Subir Nueva Foto</h2>
        
        <div class="upload-input-group">
          <label>Seleccionar foto:</label>
          <input type="file" id="upload-photo-input" accept="image/*">
        </div>
        
        <div id="upload-preview" class="upload-preview"></div>
        
        <div class="upload-input-group">
          <label>Descripción (opcional):</label>
          <input type="text" id="upload-photo-caption" placeholder="Describe este momento...">
        </div>
        
        <div class="upload-input-group">
          <label>Fecha:</label>
          <input type="date" id="upload-photo-date">
        </div>
        
        <div class="upload-buttons">
          <button onclick="uploadPhotoModule.upload()" class="upload-btn-primary" id="upload-submit-btn">
            Subir
          </button>
          <button onclick="uploadPhotoModule.close()" class="upload-btn-secondary">
            Cancelar
          </button>
        </div>
        
        <div id="upload-progress-container" class="upload-progress">
          <div class="upload-progress-bar">
            <div id="upload-progress-fill" class="upload-progress-fill"></div>
          </div>
          <p id="upload-status" class="upload-status">Subiendo...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeUploadModal();
      }
    });
  }

  function openUploadModal() {
    const modal = document.getElementById('upload-photo-modal');
    if (modal) {
      modal.classList.add('active');
      document.getElementById('upload-photo-date').valueAsDate = new Date();
    }
  }

  function closeUploadModal() {
    const modal = document.getElementById('upload-photo-modal');
    if (modal) {
      modal.classList.remove('active');
      resetForm();
    }
  }

  function resetForm() {
    document.getElementById('upload-photo-input').value = '';
    document.getElementById('upload-photo-caption').value = '';
    document.getElementById('upload-preview').innerHTML = '';
    document.getElementById('upload-progress-container').classList.remove('active');
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('upload-preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadPhoto() {
  const fileInput = document.getElementById('upload-photo-input');
  const caption = document.getElementById('upload-photo-caption').value;
  const date = document.getElementById('upload-photo-date').value;
  
  if (!fileInput.files || fileInput.files.length === 0) {
    alert('Por favor selecciona una foto 📷');
    return;
  }
  
  const file = fileInput.files[0];
  
  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona solo imágenes 🖼️');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen es muy grande. Máximo 5MB 📏');
    return;
  }
  
  const progressContainer = document.getElementById('upload-progress-container');
  const progressFill = document.getElementById('upload-progress-fill');
  const statusText = document.getElementById('upload-status');
  const submitBtn = document.getElementById('upload-submit-btn');
  
  progressContainer.classList.add('active');
  statusText.textContent = 'Subiendo...';
  submitBtn.disabled = true;
  progressFill.style.width = '30%';
  
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `foto_${timestamp}.${fileExtension}`;
    
    progressFill.style.width = '50%';
    
    // Subir archivo a Storage
    const { data, error } = await supabaseClient.storage
      .from('Fotos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    progressFill.style.width = '70%';
    
    // Obtener URL pública
    const { data: urlData } = supabaseClient.storage
      .from('Fotos')
      .getPublicUrl(fileName);
    
    progressFill.style.width = '85%';
    
    // Guardar metadatos en la tabla
    const { error: dbError } = await supabaseClient
      .from('fotos_metadata')
      .insert([{
        filename: fileName,
        caption: caption || 'Sin descripción',
        date: date || new Date().toISOString().split('T')[0],
        url: urlData.publicUrl
      }]);
    
    if (dbError) throw dbError;
    
    progressFill.style.width = '100%';
    statusText.textContent = '✅ Foto subida exitosamente';
    
    console.log('✅ Foto y metadatos guardados');
    
    setTimeout(() => {
      closeUploadModal();
      if (typeof window.openGallery === 'function') {
        window.openGallery();
      }
    }, 1500);
    
  } catch (error) {
    console.error('❌ Error:', error);
    statusText.textContent = '❌ Error: ' + error.message;
    progressFill.style.width = '0%';
    submitBtn.disabled = false;
  }
}


  window.uploadPhotoModule = {
    open: openUploadModal,
    close: closeUploadModal,
    upload: uploadPhoto
  };

})();
