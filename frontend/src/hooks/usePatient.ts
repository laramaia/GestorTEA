import { useState, useMemo, useEffect } from "react";
import type { Patient } from "../types/patient";
import api from "../services/api";

export function usePatients(itemsPerPage: number = 5) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await api.get("/Paciente/listar");
        const data = response.data.map((p: any) => ({
          id: String(p.pacienteId),
          name: p.nomeCompleto,
          tasksCompleted: "0/0",
          averageScore: 0,
          photoUrl: "",
        }));
        setPatients(data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, patients]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    loading,
  };
}
