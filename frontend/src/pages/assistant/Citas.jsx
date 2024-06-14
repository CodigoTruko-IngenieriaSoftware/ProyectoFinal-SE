import '../../assets/styles/assistant/Citas.css';
import { useState } from "react";

import Layout from './Layout';
import Overlay from './OverlayForm';


function Citas() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Layout>
            <div className="content">
                <p className="tittle">Citas Pendientes de Aprobación</p>
                <div className="citas-container">
                    <div className="paciente">
                        <div>
                            <p className="info-tittle">Nombre</p>
                            <p>Francisco Rosa</p>
                        </div>
                        <div>
                            <p className="info-tittle">Descripción</p>
                            <p>Dolor en el recto anal aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                        <div>
                            <p className="info-tittle">Fecha Solicitada</p>
                            <p>13/6/2069</p>
                        </div>
                        <div>
                            <p className="info-tittle">Estado</p>
                            <button onClick={ toggleOverlay }>Aprobar</button>
                            
                            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                                <h2>Aprobar Cita</h2>
                            </Overlay>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Citas;