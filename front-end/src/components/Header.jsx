import riffly from "../assets/logo/riffly.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="header">
      {pathname !== "/" && (
        <button type="button" className="header__back" onClick={goBack} aria-label="Voltar à tela anterior">
          ← Voltar Anterior
        </button>
      )}
      <Link to="/">
        <img src={riffly} alt="Riffly" />
      </Link>

      <Link to="/" className="header__link">
        <h1>Riffly 1.2</h1>
      </Link>
      <Link to="/admin/publicidade" className="header__admin">Publicidade Adm</Link>
    </div>
  );
};

export default Header;
