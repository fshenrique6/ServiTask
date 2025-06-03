import './Sidebar.css';
import addimg from '../assets/+.png';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">✔</span>
                <span className="sidebar-title">ServiTask</span>
            </div>
            <p className="titulo-mq">Meus quadros:</p>
            <button className="quadro-btn">EXEMPLO</button>
            <button className="add-board-btn">
                <img src={addimg} alt="Adicionar quadro" className="add-icon" />
            </button>
        </div>
    );
}

export default Sidebar;