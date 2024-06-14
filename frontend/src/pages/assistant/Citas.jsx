import '../../assets/styles/assistant/Citas.css';

import React from 'react';
import Layout from './Layout';

function Citas() {
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
                            <button>Aprobar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Citas