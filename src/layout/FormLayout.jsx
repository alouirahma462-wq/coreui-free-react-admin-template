import { Outlet } from 'react-router-dom'

const FormLayout = () => {
  return (
    <div className="form-bg">

      {/* 🧊 الكارد الزجاجي الرئيسي */}
      <div className="glass-card">

        {/* 📄 محتوى الفورمات (CaseForm وغيرها) */}
        <Outlet />

      </div>

    </div>
  )
}

export default FormLayout
