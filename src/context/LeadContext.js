 leadcontext.js
import React, { createContext, useContext, useReducer, useCallback } from "react";
import { leadsApi } from "../utils/api";
import toast from "react-hot-toast";

const LeadContext = createContext(null);

const initialState = {
  leads: [],
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
  filters: { search: "", status: "", source: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_STATS_LOADING":
      return { ...state, statsLoading: action.payload };
    case "SET_LEADS":
      return { ...state, leads: action.payload, loading: false, error: null };
    case "SET_STATS":
      return { ...state, stats: action.payload, statsLoading: false };
    case "ADD_LEAD":
      return { ...state, leads: [action.payload, ...state.leads] };
    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((l) =>
          l.id === action.payload.id ? action.payload : l
        ),
      };
    case "DELETE_LEAD":
      return { ...state, leads: state.leads.filter((l) => l.id !== action.payload) };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

export function LeadProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchLeads = useCallback(async (params = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await leadsApi.getAll(params);
      dispatch({ type: "SET_LEADS", payload: res.data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
      toast.error(err.message);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    dispatch({ type: "SET_STATS_LOADING", payload: true });
    try {
      const res = await leadsApi.getStats();
      dispatch({ type: "SET_STATS", payload: res.data });
    } catch (err) {
      dispatch({ type: "SET_STATS_LOADING", payload: false });
    }
  }, []);

  const createLead = useCallback(async (data) => {
    const res = await leadsApi.create(data);
    dispatch({ type: "ADD_LEAD", payload: res.data });
    toast.success("Lead added successfully!");
    fetchStats();
    return res;
  }, [fetchStats]);

  const updateStatus = useCallback(async (id, data) => {
    const res = await leadsApi.updateStatus(id, data);
    dispatch({ type: "UPDATE_LEAD", payload: res.data });
    toast.success("Status updated!");
    fetchStats();
  }, [fetchStats]);

  const deleteLead = useCallback(async (id) => {
    await leadsApi.delete(id);
    dispatch({ type: "DELETE_LEAD", payload: id });
    toast.success("Lead deleted");
    fetchStats();
  }, [fetchStats]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  return (
    <LeadContext.Provider
      value={{ ...state, fetchLeads, fetchStats, createLead, updateStatus, deleteLead, setFilters }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export const useLeads = () => {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLeads must be used within LeadProvider");
  return ctx;
};
