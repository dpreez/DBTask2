import { useState } from 'react';
import { Database, Table, Columns, Plus, RefreshCw } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface TableInfo {
  name: string;
  columns: Column[];
  count: number;
  sample?: any[];
}

interface Column {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

// Mock database schema for demonstration
const mockSchema: Record<string, TableInfo> = {
  'usuarios': {
    name: 'usuarios',
    columns: [
      { Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'nombre', Type: 'varchar(100)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'email', Type: 'varchar(100)', Null: 'NO', Key: 'UNI', Default: null, Extra: '' },
      { Field: 'fecha_registro', Type: 'datetime', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' },
      { Field: 'activo', Type: 'tinyint(1)', Null: 'NO', Key: '', Default: '1', Extra: '' }
    ],
    count: 358,
    sample: [
      { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', fecha_registro: '2023-05-10 08:30:00', activo: 1 }
    ]
  },
  'proyectos': {
    name: 'proyectos',
    columns: [
      { Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'nombre', Type: 'varchar(200)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'cliente_id', Type: 'int', Null: 'NO', Key: 'MUL', Default: null, Extra: '' },
      { Field: 'estado', Type: 'enum', Null: 'NO', Key: '', Default: 'Planificación', Extra: '' },
      { Field: 'fecha_inicio', Type: 'date', Null: 'YES', Key: '', Default: null, Extra: '' },
      { Field: 'fecha_fin', Type: 'date', Null: 'YES', Key: '', Default: null, Extra: '' }
    ],
    count: 125,
    sample: [
      { id: 101, nombre: 'Renovación Oficinas', cliente_id: 5, estado: 'En progreso', fecha_inicio: '2024-01-15', fecha_fin: null }
    ]
  },
  'documentos': {
    name: 'documentos',
    columns: [
      { Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'proyecto_id', Type: 'int', Null: 'NO', Key: 'MUL', Default: null, Extra: '' },
      { Field: 'tipo', Type: 'varchar(50)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'nombre', Type: 'varchar(200)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'ruta', Type: 'varchar(500)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'fecha_creacion', Type: 'datetime', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' }
    ],
    count: 872,
    sample: [
      { id: 501, proyecto_id: 101, tipo: 'Especificación', nombre: 'Especificación Técnica', ruta: '/docs/101/spec.pdf', fecha_creacion: '2024-01-20 13:45:00' }
    ]
  },
  'clientes': {
    name: 'clientes',
    columns: [
      { Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'nombre', Type: 'varchar(100)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'contacto', Type: 'varchar(100)', Null: 'YES', Key: '', Default: null, Extra: '' },
      { Field: 'email', Type: 'varchar(100)', Null: 'YES', Key: '', Default: null, Extra: '' },
      { Field: 'telefono', Type: 'varchar(20)', Null: 'YES', Key: '', Default: null, Extra: '' }
    ],
    count: 43,
    sample: [
      { id: 5, nombre: 'Constructora XYZ', contacto: 'Ana Ramírez', email: 'ana@xyz.com', telefono: '+1234567890' }
    ]
  },
  'historial': {
    name: 'historial',
    columns: [
      { Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'entidad', Type: 'varchar(50)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'entidad_id', Type: 'int', Null: 'NO', Key: 'MUL', Default: null, Extra: '' },
      { Field: 'accion', Type: 'varchar(50)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'datos', Type: 'text', Null: 'YES', Key: '', Default: null, Extra: '' },
      { Field: 'usuario_id', Type: 'int', Null: 'NO', Key: 'MUL', Default: null, Extra: '' },
      { Field: 'fecha', Type: 'datetime', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' }
    ],
    count: 11067,
    sample: [
      { id: 15001, entidad: 'documentos', entidad_id: 501, accion: 'crear', datos: '{"nombre":"Especificación Técnica"}', usuario_id: 1, fecha: '2024-01-20 13:45:00' }
    ]
  }
};

function Explore() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'sample'>('structure');
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefreshSchema = () => {
    setRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Helper to generate CREATE TABLE SQL
  const generateCreateTableSQL = (table: TableInfo): string => {
    const columnDefs = table.columns.map(col => {
      let def = `  \`${col.Field}\` ${col.Type}`;
      
      if (col.Null === 'NO') def += ' NOT NULL';
      if (col.Default !== null) {
        if (col.Default === 'CURRENT_TIMESTAMP') {
          def += ' DEFAULT CURRENT_TIMESTAMP';
        } else {
          def += ` DEFAULT '${col.Default}'`;
        }
      }
      if (col.Extra) def += ` ${col.Extra}`;
      if (col.Key === 'PRI') def += ' PRIMARY KEY';
      
      return def;
    }).join(',\n');
    
    return `CREATE TABLE \`${table.name}\` (\n${columnDefs}\n);`;
  };
  
  return (
    <div className="max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Database size={24} className="mr-2 text-primary" />
          Database Explorer
        </h1>
        
        <button
          onClick={handleRefreshSchema}
          className="btn btn-outline flex items-center gap-2"
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Schema</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tables List */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h2 className="font-medium flex items-center">
                <Table size={16} className="mr-2" />
                Tables
              </h2>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {Object.keys(mockSchema).length}
              </span>
            </div>
            
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              <ul className="divide-y divide-border">
                {Object.entries(mockSchema).map(([tableName, tableInfo]) => (
                  <li key={tableName}>
                    <button
                      onClick={() => setSelectedTable(tableName)}
                      className={`w-full text-left p-3 flex items-center justify-between hover:bg-background/80 transition-colors ${
                        selectedTable === tableName ? 'bg-primary/5 text-primary' : ''
                      }`}
                    >
                      <span className="font-mono text-sm">{tableName}</span>
                      <span className="text-xs text-foreground/70">{tableInfo.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Table Details */}
        <div className="flex-1">
          {selectedTable ? (
            <div className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium flex items-center">
                    <Table size={18} className="mr-2 text-primary" />
                    {selectedTable}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs px-2 py-1 bg-background rounded-md">
                      {mockSchema[selectedTable].count} rows
                    </span>
                    <span className="text-xs px-2 py-1 bg-background rounded-md">
                      {mockSchema[selectedTable].columns.length} columns
                    </span>
                  </div>
                </div>
                
                <div className="flex mt-4 border-b border-border">
                  <button
                    onClick={() => setActiveTab('structure')}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'structure' 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    Structure
                  </button>
                  <button
                    onClick={() => setActiveTab('sample')}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'sample' 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    Sample Data
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {activeTab === 'structure' ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-background">
                            <th className="text-left p-2 font-medium">Column</th>
                            <th className="text-left p-2 font-medium">Type</th>
                            <th className="text-left p-2 font-medium">Nullable</th>
                            <th className="text-left p-2 font-medium">Key</th>
                            <th className="text-left p-2 font-medium">Default</th>
                            <th className="text-left p-2 font-medium">Extra</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockSchema[selectedTable].columns.map((column, i) => (
                            <tr key={i} className="border-b border-border hover:bg-background/50">
                              <td className="p-2 font-medium font-mono">{column.Field}</td>
                              <td className="p-2 font-mono">{column.Type}</td>
                              <td className="p-2">{column.Null === 'NO' ? 'NOT NULL' : 'NULL'}</td>
                              <td className="p-2">
                                {column.Key === 'PRI' && (
                                  <span className="px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary">
                                    PRIMARY
                                  </span>
                                )}
                                {column.Key === 'UNI' && (
                                  <span className="px-1.5 py-0.5 text-xs rounded bg-warning/10 text-warning">
                                    UNIQUE
                                  </span>
                                )}
                                {column.Key === 'MUL' && (
                                  <span className="px-1.5 py-0.5 text-xs rounded bg-accent/10 text-accent">
                                    INDEX
                                  </span>
                                )}
                              </td>
                              <td className="p-2 font-mono">{column.Default || ''}</td>
                              <td className="p-2">{column.Extra}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 text-sm">CREATE TABLE SQL</h3>
                      <SyntaxHighlighter
                        language="sql"
                        style={a11yDark}
                        customStyle={{
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {generateCreateTableSQL(mockSchema[selectedTable])}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Sample Data (1 row)</h3>
                    {mockSchema[selectedTable].sample && mockSchema[selectedTable].sample.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-background">
                              {Object.keys(mockSchema[selectedTable].sample![0]).map((key) => (
                                <th key={key} className="text-left p-2 font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {mockSchema[selectedTable].sample!.map((row, i) => (
                              <tr key={i} className="border-b border-border hover:bg-background/50">
                                {Object.values(row).map((value: any, j) => (
                                  <td key={j} className="p-2 font-mono">
                                    {value === null ? <span className="text-foreground/40">NULL</span> : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-foreground/70">No sample data available</p>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 text-sm">Query Example</h3>
                      <SyntaxHighlighter
                        language="sql"
                        style={a11yDark}
                        customStyle={{
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {`SELECT * FROM ${selectedTable} LIMIT 10;`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <Columns size={48} className="mx-auto text-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">Select a Table</h3>
              <p className="text-foreground/70 mt-2">
                Choose a table from the list to view its structure and sample data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;