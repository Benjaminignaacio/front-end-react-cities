import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { Modal } from 'react-bootstrap';
import config from './config'

const RegionsTable = () => {
  const [regions, setRegions] = useState([]);
  const [search, setSearch] = useState('');
  const [newRegion, setNewRegion] = useState({ name: '', provinces: [] });
  const [editModalShow, setEditModalShow] = useState(false);
  const [editRegion, setEditRegion] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiBaseUrl}/regions`)
      .then((response) => {
        setRegions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get(`${config.apiBaseUrl}/provinces`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error);
      });

    axios.get(`${config.apiBaseUrl}/cities`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleNewRegionChange = (e) => {
    const { name, value } = e.target;
    setNewRegion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProvinceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProvinces = newRegion.provinces.map((province, i) => (
      i === index ? { ...province, [name]: value } : province
    ));
    setNewRegion((prev) => ({ ...prev, provinces: updatedProvinces }));
  };

  const handleAddCityChange = (e, provinceIndex, cityIndex) => {
    const { name, value } = e.target;
    const updatedProvinces = newRegion.provinces.map((province, i) => (
      i === provinceIndex
        ? { ...province, cities: province.cities.map((city, j) => (
          j === cityIndex ? { ...city, [name]: value } : city
        )) }
        : province
    ));
    setNewRegion((prev) => ({ ...prev, provinces: updatedProvinces }));
  };

  const handleAddRegion = (e) => {
    e.preventDefault();


    if (!newRegion.name) {
      Swal.fire('Error', 'El nombre de la región es obligatorio.', 'error');
      return;
    }

    if (newRegion.provinces.length === 0) {
      Swal.fire('Error', 'Debe agregar al menos una provincia.', 'error');
      return;
    }

    for (const province of newRegion.provinces) {
      if (!province.name) {
        Swal.fire('Error', 'El nombre de la provincia es obligatorio.', 'error');
        return;
      }
      if (province.cities.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos una ciudad por provincia.', 'error');
        return;
      }
      for (const city of province.cities) {
        if (!city.name) {
          Swal.fire('Error', 'El nombre de la ciudad es obligatorio.', 'error');
          return;
        }
      }
    }

    axios.post(`${config.apiBaseUrl}/regions`, newRegion)
      .then((response) => {
        setRegions([...regions, response.data]);
        setNewRegion({ name: '', provinces: [] }); 
        Swal.fire('Éxito', 'La región ha sido agregada correctamente.', 'success');
      })
      .catch((error) => {
        console.error('Error adding region:', error);
        Swal.fire('Error', 'Ocurrió un error al agregar la región.', 'error');
      });
  };

  const handleEditRegionChange = (e) => {
    setEditRegion({ ...editRegion, name: e.target.value });
  };

  const handleEdit = (region) => {
    setEditRegion(region);
    setEditModalShow(true);
  };

  const handleUpdateRegion = (e) => {
    e.preventDefault();

    axios.put(`${config.apiBaseUrl}/regions/${editRegion.id}`, editRegion)
      .then((response) => {
        setRegions(regions.map((region) => region.id === response.data.id ? response.data : region));
        setEditModalShow(false);
        setEditRegion(null);
        Swal.fire('Éxito', 'La región ha sido actualizada correctamente.', 'success');
      })
      .catch((error) => {
        console.error('Error updating region:', error);
        Swal.fire('Error', 'Ocurrió un error al actualizar la región.', 'error');
      });
  };

  const handleDelete = (regionId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${config.apiBaseUrl}/regions/${regionId}`)
          .then(() => {
            setRegions(regions.filter((region) => region.id !== regionId));
            Swal.fire('Eliminado', 'La región ha sido eliminada.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting region:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar la región.', 'error');
          });
      }
    });
  };

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Insertar</h1>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Agregar información</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddRegion} className="mb-4">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Nombre de la nueva región"
                value={newRegion.name}
                onChange={handleNewRegionChange}
              />
            </div>
            <div className="form-group">
              <h5>Provincias</h5>
              {newRegion.provinces.map((province, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Nombre de la provincia"
                    value={province.name}
                    onChange={(e) => handleAddProvinceChange(e, index)}
                  />
                  <h6>Ciudades</h6>
                  {province.cities.map((city, cityIndex) => (
                    <input
                      key={cityIndex}
                      type="text"
                      name="name"
                      className="form-control mb-2"
                      placeholder="Nombre de la ciudad"
                      value={city.name}
                      onChange={(e) => handleAddCityChange(e, index, cityIndex)}
                    />
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={() => setNewRegion(prev => ({
                      ...prev,
                      provinces: prev.provinces.map((prov, i) =>
                        i === index
                          ? { ...prov, cities: [...prov.cities, { name: '' }] }
                          : prov
                      )
                    }))}
                  >
                    Añadir Ciudad
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setNewRegion(prev => ({
                  ...prev,
                  provinces: [...prev.provinces, { name: '', cities: [] }]
                }))}
              >
                Añadir Provincia
              </button>
            </div>
            <button type="submit" className="btn btn-primary">Agregar Región</button>
          </form>

          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegions.map((region) => (
                  <tr key={region.id}>
                    <td>{region.name}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(region)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(region.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

     
          <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Región</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdateRegion}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    value={editRegion?.name || ''}
                    onChange={handleEditRegionChange}
                    placeholder="Nombre de la región"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Región</button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default RegionsTable;
