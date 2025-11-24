import React, { useRef } from 'react';

export default function OtpInput({ otpCode, setOTPCode }) {
  // Array of Refs
  const inputRefs = useRef([]);

  const handleInputChange = (value, index) => {
    if (!/^\d$/.test(value) && value !== '') return;

    // Convert otpCode to array
    const otpArray = otpCode.split('');

    // Insert value
    otpArray[index] = value;

    const newOtpCode = otpArray.join('');

    setOTPCode(newOtpCode);

    // Auto move to next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pasteData)) {
      setOTPCode(pasteData);

      pasteData.split('').forEach((char, idx) => {
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = char;
        }
      });

      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="otp-group" dir="ltr">
      {[...Array(4)].map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          className="otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={1}
          value={otpCode[idx] || ''}
          onChange={(e) => handleInputChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
