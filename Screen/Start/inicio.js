// Screen/Start/inicio.js
import React from 'react';
import DashboardComponent from '../Pacientes/DashboardPaciente';

export default function Inicio({ route }) {

    const userType = 'Paciente';

    return (
        <DashboardComponent userType={userType} />
    );
}