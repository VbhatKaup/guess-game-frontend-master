import React from 'react';

type NameInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

const NameInput: React.FC<NameInputProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter your guess..."
        style={{ padding: '8px', fontSize: '16px', width: '200px' }}
      />
      <button
        onClick={onSubmit}
        style={{
          marginLeft: '10px',
          padding: '8px 12px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        ✅ Submit
      </button>
    </div>
  );
};

export default NameInput;
