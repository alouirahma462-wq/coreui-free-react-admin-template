const FormWrapper = ({ children }) => {
  return (
    <div className="form-bg">
      <div className="glass-card">
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
