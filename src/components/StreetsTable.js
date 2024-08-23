import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StreetsTable = () => {
  const [streets, setStreets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStreets();
  }, []);

  const fetchStreets = () => {
    axios.get('http://localhost:8000/api/streets')
      .then((response) => {
        console.log(response.data); 
        setStreets(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = (streetId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8000/api/streets/${streetId}`)
          .then(() => {
            Swal.fire(
              'Eliminada!',
              'La calle ha sido eliminada.',
              'success'
            );
            fetchStreets(); // Vuelve a cargar las calles después de la eliminación
          })
          .catch((error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la calle.',
              'error'
            );
            console.error('Error deleting street:', error);
          });
      }
    });
  };

  const filteredStreets = streets.filter((street) =>
    street.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Grilla de Calles</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Buscar Calles</h6>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar calles..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Región</th>
                  <th>Provincia</th>
                  <th>Ciudad</th>
                  <th>Acciones</th> {/* Columna para las acciones */}
                </tr>
              </thead>
              <tbody>
                {filteredStreets.map((street) => (
                  <tr key={street.id}>
                    <td>{street.name}</td>
                    <td>{street.region?.name || 'N/A'}</td>
                    <td>{street.province?.name || 'N/A'}</td>
                    <td>{street.city?.name || 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(street.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetsTable;
