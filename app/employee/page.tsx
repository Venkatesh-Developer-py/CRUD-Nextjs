"use client"

import { useEffect, useState } from "react"
import "./page.css"
import { useRouter } from "next/navigation"

interface Employe_Details {
  id: number
  Employe_name: string
  Employe_age: string
  Employe_gender: string
  Employe_designation: string
  Employe_salary: string
  Employe_number: string
}

export default function EmployeePage() {
  const router = useRouter()

  const [Details, setDetails] = useState<Employe_Details[]>([])
  const [search, setSearch] = useState("")

  const [Employe_name, setEmployeName] = useState("")
  const [Employe_age, setEmployeAge] = useState("")
  const [Employe_gender, setEmployeGender] = useState("")
  const [Employe_designation, setEmployeDesignation] = useState("")
  const [Employe_salary, setEmployeSalary] = useState("")
  const [Employe_number, setEmployeNumber] = useState("")
  const [editId, setEditId] = useState<number | null>(null)

 
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const API_URL = "https://django-nextjs-backend-m93z.onrender.com/api/backend"

  const fetchDetails = async () => {
    const response = await fetch(`${API_URL}/`)
    const data = await response.json()
    setDetails(data)
  }

  useEffect(() => {
    fetchDetails()
  }, [])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [])

  const handleButton = async () => {
    if (!Employe_name || !Employe_age || !Employe_gender || !Employe_designation || !Employe_salary || !Employe_number) {
      return alert("Fill all fields")
    }

   if (Employe_number.length !== 10) {
      return alert("Enter valid 10 digit number")
  }

    const payload = {
      Employe_name,
      Employe_age,
      Employe_gender,
      Employe_designation,
      Employe_salary,
      Employe_number
    }

    if (editId !== null) {
      await fetch(`${API_URL}/${editId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    } else {
      await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    }

    clearForm()
    fetchDetails()
  }

  const clearForm = () => {
    setEmployeName("")
    setEmployeAge("")
    setEmployeGender("")
    setEmployeDesignation("")
    setEmployeSalary("")
    setEmployeNumber("")
    setEditId(null)
  }

  const editDetails = (item: Employe_Details) => {
    setEmployeName(item.Employe_name)
    setEmployeAge(item.Employe_age)
    setEmployeGender(item.Employe_gender)
    setEmployeDesignation(item.Employe_designation)
    setEmployeSalary(item.Employe_salary)
    setEmployeNumber(item.Employe_number)
    setEditId(item.id)
  }

  const deleteDetails = async (id: number) => {
    await fetch(`${API_URL}/${id}/`, { method: "DELETE" })
    fetchDetails()
  }


  const filteredEmployees = Details.filter((item) =>
    item.Employe_name.toLowerCase().includes(search.toLowerCase())
  )

  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  return (
    <>
    <div className="dashboard-page">
      <div className="navbar">
        <div className="logo">Employee Dashboard</div>

        <div className="nav-right">
          <input
            className="search-box"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1) 
            }}
          />

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("isLoggedIn")
              router.replace("/")
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="page-wrapper">
<div className="form-card">
  <h2>{editId ? "Update Employee Details" : "Add New Employee"}</h2>
  
  <div className="form-grid">
   
    <input
      placeholder="Full Name *"
      value={Employe_name}
      onChange={(e) => setEmployeName(e.target.value)}
      required
    />
    
    <input
      type="number"
      placeholder="Age *"
      value={Employe_age}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 100)) {
          setEmployeAge(value);
        }
      }}
      min="18"
      max="100"
      required
    />
    
    
    <div className="form-group full-width">
      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="gender" 
            value="Male"
            checked={Employe_gender === "Male"}
            onChange={(e) => setEmployeGender(e.target.value)}
            required
          />
          Male
        </label>
        
        <label className="radio-option">
          <input
            type="radio"
            name="gender" 
            value="Female"
            checked={Employe_gender === "Female"}
            onChange={(e) => setEmployeGender(e.target.value)}
            required
          />
          Female
        </label>
      </div>
    </div>
    
    <select
      value={Employe_designation}
      onChange={(e) => setEmployeDesignation(e.target.value)}
      required
    >
      <option value="">Select Designation *</option>
      <option value="Developer">Developer</option>
      <option value="Manager">Manager</option>
      <option value="HR">HR</option>
      <option value="Tester">Tester</option>
      <option value="Designer">Designer</option>
      <option value="Admin">Admin</option>
    </select>
    
    <input
      type="number"
      placeholder="Salary (₹) *"
      value={Employe_salary}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setEmployeSalary(value);
        }
      }}
      min="0"
      required
    />
    
    
    <div className="form-group full-width">
      <input
        type="tel"
        placeholder="Phone Number (10 digits) *"
        value={Employe_number}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) {
            setEmployeNumber(value);
          }
        }}
        maxLength={10}
        required
      />
    </div>
  </div>
  
  <button onClick={handleButton} className="primary-btn">
    {editId ? "💾 Update" : "➕ Add Employee"}
  </button>
</div>

        <div className="list-card">
          {currentEmployees.length === 0 ? (
            <p className="no-record">No Employees Found</p>
          ) : (
            currentEmployees.map((item) => (
              <div key={item.id} className="employee-row">
                <div>
                  <strong>{item.Employe_name}</strong>
                  <div className="employee-meta">
                    {item.Employe_age} yrs • {item.Employe_gender} • {item.Employe_designation} • {item.Employe_number} • ₹{item.Employe_salary}
                  </div>
                </div>

                <div className="employee-actions">
                  <button onClick={() => editDetails(item)} className="edit-btn">
                    Edit
                  </button>

                  <button onClick={() => deleteDetails(item.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        
        {filteredEmployees.length > 0 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
    </>
  )
}