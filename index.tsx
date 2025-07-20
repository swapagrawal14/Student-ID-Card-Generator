/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import html2canvas from 'html2canvas';

// Helper function to safely get elements by ID
function getElementById<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element as T;
}

// Helper function to read a file and update an image element's src
function handleFileUpload(fileInput: HTMLInputElement, previewImg: HTMLImageElement, fileNameSpan: HTMLSpanElement) {
    const file = fileInput.files?.[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                previewImg.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = 'No file chosen';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const form = getElementById<HTMLFormElement>('id-form');
    const downloadBtn = getElementById<HTMLButtonElement>('download-btn');
    const idCardElement = getElementById<HTMLDivElement>('id-card');

    // --- Form Inputs ---
    // College
    const collegeNameInput = getElementById<HTMLInputElement>('college-name');
    const collegeTaglineInput = getElementById<HTMLInputElement>('college-tagline');
    const collegeFooterInput = getElementById<HTMLInputElement>('college-footer');
    const collegeLogoInput = getElementById<HTMLInputElement>('college-logo');
    const collegeLogoName = getElementById<HTMLSpanElement>('college-logo-name');

    // Student
    const nameInput = getElementById<HTMLInputElement>('name');
    const studentIdInput = getElementById<HTMLInputElement>('student-id');
    const mobileInput = getElementById<HTMLInputElement>('mobile');
    const emergencyContactInput = getElementById<HTMLInputElement>('emergency-contact');
    const departmentInput = getElementById<HTMLInputElement>('department');
    const sessionInput = getElementById<HTMLInputElement>('session');
    const bloodGroupInput = getElementById<HTMLInputElement>('blood-group');
    const photoInput = getElementById<HTMLInputElement>('photo');
    const fileNameSpan = getElementById<HTMLSpanElement>('file-name');

    // Signature
    const sigTypeText = getElementById<HTMLInputElement>('signature-type-type');
    const sigTypeUpload = getElementById<HTMLInputElement>('signature-type-upload');
    const sigTextInput = getElementById<HTMLInputElement>('signature-text');
    const sigUploadInput = getElementById<HTMLInputElement>('signature-upload');
    const sigTextGroup = getElementById<HTMLDivElement>('signature-text-group');
    const sigUploadGroup = getElementById<HTMLDivElement>('signature-upload-group');
    const sigUploadName = getElementById<HTMLSpanElement>('signature-upload-name');

    // --- Preview Elements ---
    // College
    const previewCollegeName = getElementById<HTMLElement>('preview-college-name');
    const previewCollegeTagline = getElementById<HTMLElement>('preview-college-tagline');
    const previewCollegeFooterName = getElementById<HTMLElement>('preview-college-footer-name');
    const previewCollegeFooter = getElementById<HTMLElement>('preview-college-footer');
    const previewLogo = getElementById<HTMLImageElement>('preview-logo');

    // Student
    const previewName = getElementById<HTMLElement>('preview-name');
    const previewStudentId = getElementById<HTMLElement>('preview-student-id');
    const previewMobile = getElementById<HTMLElement>('preview-mobile');
    const previewEmergencyContact = getElementById<HTMLElement>('preview-emergency-contact');
    const previewDepartment = getElementById<HTMLElement>('preview-department');
    const previewSession = getElementById<HTMLElement>('preview-session');
    const previewBloodGroup = getElementById<HTMLElement>('preview-blood-group');
    const previewPhoto = getElementById<HTMLImageElement>('preview-photo');

    // Signature
    const previewSigText = getElementById<HTMLDivElement>('preview-signature-text');
    const previewSigImg = getElementById<HTMLImageElement>('preview-signature-img');


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
    form.addEventListener('submit', (e: Event) => {
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