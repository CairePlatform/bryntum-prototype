import "./EmployeeManager.scss";

import { useState } from "react";

export interface EmployeeManagerProps {
  onClose: () => void;
  onAddEmployee: (employee: any) => void;
  onUpdateEmployee: (employee: any) => void;
  onDeleteEmployee: (id: number) => void;
  employees: any[];
}

export function EmployeeManager({
  onClose,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  employees,
}: EmployeeManagerProps) {
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "Undersköterska",
    contractType: "Heltid",
    transportMode: "Bil",
    serviceArea: "Centrum",
    hourlyRate: 280,
    workStart: "07:00",
    workEnd: "16:00",
  });

  const roles = [
    "Sjuksköterska",
    "Undersköterska",
    "Vårdbiträde",
    "Sjukgymnast",
    "Arbetsterapeut",
  ];

  const contractTypes = ["Heltid", "Timanställd"];
  const transportModes = ["Bil", "Cykel", "Promenad", "Kollektivtrafik"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEmployee) {
      onUpdateEmployee({ ...editingEmployee, ...formData });
    } else {
      const newEmployee = {
        id: Math.max(0, ...employees.map((e) => e.id)) + 1,
        ...formData,
        calendar: "day-shift",
        image: `user-${Math.floor(Math.random() * 10) + 1}.jpg`,
        roleIconCls: "fa fa-user-md",
        skillTags: [formData.role],
      };
      onAddEmployee(newEmployee);
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      role: "Undersköterska",
      contractType: "Heltid",
      transportMode: "Bil",
      serviceArea: "Centrum",
      hourlyRate: 280,
      workStart: "07:00",
      workEnd: "16:00",
    });
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      contractType: employee.contractType,
      transportMode: employee.transportMode,
      serviceArea: employee.serviceArea || "Centrum",
      hourlyRate: employee.hourlyRate || 280,
      workStart: "07:00",
      workEnd: "16:00",
    });
  };

  const handleDelete = (employee: any) => {
    if (confirm(`Ta bort ${employee.name}?`)) {
      onDeleteEmployee(employee.id);
    }
  };

  return (
    <div className="employee-manager-overlay" onClick={onClose}>
      <div className="employee-manager" onClick={(e) => e.stopPropagation()}>
        <div className="manager-header">
          <h2>Hantera Medarbetare</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="manager-content">
          <div className="employee-form">
            <h3>{editingEmployee ? "Redigera" : "Lägg till"} Medarbetare</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Namn
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Roll
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Kontrakt
                  <select
                    value={formData.contractType}
                    onChange={(e) =>
                      setFormData({ ...formData, contractType: e.target.value })
                    }
                  >
                    {contractTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Transport
                  <select
                    value={formData.transportMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transportMode: e.target.value,
                      })
                    }
                  >
                    {transportModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Timlön (kr)
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyRate: parseInt(e.target.value),
                      })
                    }
                    min="0"
                    step="10"
                  />
                </label>
                <label>
                  Serviceområde
                  <input
                    type="text"
                    value={formData.serviceArea}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceArea: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="form-actions">
                {editingEmployee && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-cancel"
                  >
                    Avbryt
                  </button>
                )}
                <button type="submit" className="btn-submit">
                  {editingEmployee ? "Uppdatera" : "Lägg till"}
                </button>
              </div>
            </form>
          </div>

          <div className="employee-list">
            <h3>Medarbetare ({employees.length})</h3>
            <div className="employee-items">
              {employees.map((employee) => (
                <div key={employee.id} className="employee-item">
                  <div className="employee-info">
                    <div className="employee-name">{employee.name}</div>
                    <div className="employee-details">
                      {employee.role} • {employee.contractType}
                    </div>
                  </div>
                  <div className="employee-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(employee)}
                      title="Redigera"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(employee)}
                      title="Ta bort"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
