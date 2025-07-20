/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import html2canvas from 'html2canvas';

// Helper function to safely get elements by ID
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element;
}

// Helper function to read a file and update an image element's src
function handleFileUpload(fileInput, previewImg, fileNameSpan) {
    const file = fileInput.files?.[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                previewImg.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = 'No file chosen';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const form = getElementById('id-form');
    const downloadBtn = getElementById('download-btn');
    const idCardElement = getElementById('id-card');

    // --- Form Inputs ---
    // College
    const collegeNameInput = getElementById('college-name');
    const collegeTaglineInput = getElementById('college-tagline');
    const collegeFooterInput = getElementById('college-footer');
    const collegeLogoInput = getElementById('college-logo');
    const collegeLogoName = getElementById('college-logo-name');

    // Student
    const nameInput = getElementById('name');
    const studentIdInput = getElementById('student-id');
    const mobileInput = getElementById('mobile');
    const emergencyContactInput = getElementById('emergency-contact');
    const departmentInput = getElementById('department');
    const sessionInput = getElementById('session');
    const bloodGroupInput = getElementById('blood-group');
    const photoInput = getElementById('photo');
    const fileNameSpan = getElementById('file-name');

    // Signature
    const sigTypeText = getElementById('signature-type-type');
    const sigTypeUpload = getElementById('signature-type-upload');
    const sigTextInput = getElementById('signature-text');
    const sigUploadInput = getElementById('signature-upload');
    const sigTextGroup = getElementById('signature-text-group');
    const sigUploadGroup = getElementById('signature-upload-group');
    const sigUploadName = getElementById('signature-upload-name');

    // --- Preview Elements ---
    // College
    const previewCollegeName = getElementById('preview-college-name');
    const previewCollegeTagline = getElementById('preview-college-tagline');
    const previewCollegeFooterName = getElementById('preview-college-footer-name');
    const previewCollegeFooter = getElementById('preview-college-footer');
    const previewLogo = getElementById('preview-logo');

    // Student
    const previewName = getElementById('preview-name');
    const previewStudentId = getElementById('preview-student-id');
    const previewMobile = getElementById('preview-mobile');
    const previewEmergencyContact = getElementById('preview-emergency-contact');
    const previewDepartment = getElementById('preview-department');
    const previewSession = getElementById('preview-session');
    const previewBloodGroup = getElementById('preview-blood-group');
    const previewPhoto = getElementById('preview-photo');

    // Signature
    const previewSigText = getElementById('preview-signature-text');
    const previewSigImg = getElementById('preview-signature-img');


    function updatePreview() {
        // College Details
        previewCollegeName.textContent = collegeNameInput.value || 'COLLEGE NAME';
        previewCollegeTagline.textContent = collegeTaglineInput.value || 'College Tagline';
        previewCollegeFooterName.textContent = collegeNameInput.value || 'COLLEGE NAME';
        previewCollegeFooter.textContent = collegeFooterInput.value || 'College Address';

        // Student Details
        previewName.textContent = nameInput.value || 'Your Name';
        previewStudentId.textContent = studentIdInput.value || 'XXXXXXXXXX';
        previewMobile.textContent = mobileInput.value || '0000000000';
        previewEmergencyContact.textContent = emergencyContactInput.value || '0000000000';
        previewDepartment.textContent = departmentInput.value || 'Your Department';
        previewSession.textContent = sessionInput.value || '20XX-XX';
        previewBloodGroup.textContent = bloodGroupInput.value || 'X+';

        // Signature
        if (sigTypeText.checked) {
            previewSigText.textContent = sigTextInput.value || 'Authority';
            previewSigText.style.display = 'block';
            previewSigImg.style.display = 'none';
        } else {
            previewSigText.style.display = 'none';
            previewSigImg.style.display = 'block';
        }
    }

    // --- Event Listeners ---
    form.addEventListener('input', updatePreview);

    // File Upload Listeners
    photoInput.addEventListener('change', () => handleFileUpload(photoInput, previewPhoto, fileNameSpan));
    collegeLogoInput.addEventListener('change', () => handleFileUpload(collegeLogoInput, previewLogo, collegeLogoName));
    sigUploadInput.addEventListener('change', () => {
        handleFileUpload(sigUploadInput, previewSigImg, sigUploadName);
        sigTypeUpload.checked = true; // Switch to upload mode
        updatePreview();
        sigTextGroup.style.display = 'none';
        sigUploadGroup.style.display = 'block';
    });

    // Signature Type Switcher
    [sigTypeText, sigTypeUpload].forEach(radio => {
        radio.addEventListener('change', () => {
            if (sigTypeText.checked) {
                sigTextGroup.style.display = 'block';
                sigUploadGroup.style.display = 'none';
            } else {
                sigTextGroup.style.display = 'none';
                sigUploadGroup.style.display = 'block';
            }
            updatePreview();
        });
    });

    // Finalize button handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        downloadBtn.disabled = false;
        idCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Download button handler
    downloadBtn.addEventListener('click', () => {
        if (downloadBtn.disabled) return;
        
        html2canvas(idCardElement, {
            scale: 3,
            useCORS: true, 
            backgroundColor: null, 
        }).then(canvas => {
            const link = document.createElement('a');
            const studentId = studentIdInput.value || 'student';
            link.download = `id-card-${studentId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Oops, something went wrong!', err);
            alert('Could not download the ID card. Please try again.');
        });
    });

    // Initial call to set defaults
    updatePreview();
});
