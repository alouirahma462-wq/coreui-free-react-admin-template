const FormWrapper = ({ children }) => {
  return (
    <div className="form-bg">
      <div className="glass-card">
        <div className="form-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;

