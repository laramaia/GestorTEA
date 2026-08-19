import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import type { Therapist } from "../types/therapist";

export function useTherapist(pageSize: number) {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true);
        const response = await api.get<Therapist[]>("Terapeuta/listar");
        setTherapists(response.data);
      } catch (error) {
        console.error("Erro ao buscar terapeutas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTherapists();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) =>
      therapist.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [therapists, searchTerm]);

  const totalPages = Math.ceil(filteredTherapists.length / pageSize);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTherapists.slice(start, start + pageSize);
  }, [filteredTherapists, currentPage, pageSize]);

  const deleteTherapist = async (id: number) => {
    try {
      await api.delete(`/Terapeuta/deletar/${id}`);
      setTherapists((prev) => prev.filter((t) => t.terapeutaId !== id));
    } catch (error) {
      console.error("Erro ao deletar terapeuta:", error);
    }
  };

  return {
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    loading,
    deleteTherapist,
  };
}
