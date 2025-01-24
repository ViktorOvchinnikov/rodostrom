import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router'
import { Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape'
import './FamilyTree.css';
import {CustomNode} from './CustomNode';
import AncestorSearch from './AncestorSearch';
import sampleData from '../sample.json';
import Modal from './Modal';

register({
  shape: 'custom-react-node',
  width: 100,
  height: 100,
  zIndex: 10,
  component: CustomNode,
})

const FamilyTree = () => {
  const location = useLocation();
  
  // handlers for x6 graph
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [parentNode, setParentNode] = useState(null);
  const [view, setView] = useState('familyTree'); // 'familyTree' or 'ancestorSearch'

  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [firstSelectedNode, setFirstSelectedNode] = useState(null);

  const toggleAddingEdge = () => {
    if (isAddingEdge) {
      setIsAddingEdge(false);
      setFirstSelectedNode(null);
    } else {
      setIsAddingEdge(true);
      setFirstSelectedNode(null);
    }
  };

  let isPanning = false;
  let startPoint = null;
  let startPosition = null;
  let initialTranslate = { x: 0, y: 0 };
  let isDragging = false;
  let draggingNode = null;

  // handle search modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // handle helper modal
  const [isHelperModalOpen, setHelperModalOpen] = useState(false);

  // export graph as json
  const exportGraph = () => {
    if (graph) {
      const data = graph.toJSON();
      const jsonString = JSON.stringify(data, null, 2);
      console.log('Экспортированные данные графа:', jsonString);
    }
  };
  
  // import graph from json
  const importGraph = (jsonString) => {
    if (graph) {
      try {
        const data = JSON.parse(jsonString);
        graph.fromJSON(data);
        console.log('Граф успешно импортирован');
      } catch (error) {
        console.error('Ошибка при импорте графа:', error);
      }
    }
  };
  
  const addNode = (data) => {
    if (!graph) return;

    if(!parentNode){
      const node = graph.addNode({
        shape: 'custom-react-node',
        x: -800, // Default position (adjust as needed)
        y: 400,
        data,
      });
      setIsModalOpen(false); // Close the modal after adding the node
      toggleAddingEdge();
      setHelperModalOpen(true);
      setFirstSelectedNode(node);
    }
    else{
      const { x, y } = parentNode.position();
      const xOffset = data.gender === 'male' ? -100 : 100; // -100 for male, +100 for female

      const newNode = graph.addNode({
        shape: 'custom-react-node',
        x: x + xOffset,
        y: y - 200,
        data,
      });
      graph.addEdge({
        source: parentNode,
        target: newNode,
        zIndex: 1,
      });

      setIsModalOpen(false); // Close the modal after adding the node
      setParentNode(null);
    }
  };

  useEffect(() => {
    const g = new Graph({
      container: containerRef.current,
      autoResize: true,
      background: {
        color: '#edf0f4',
      },
      grid: {
        size: 10,
        visible: true,
      },
      interacting: {
        nodeMovable: false,
      }
    });

    graphRef.current = g;

    const initialNode = g.addNode({
      shape: 'custom-react-node',
      x: 300,
      y: 250,
      width: 100,
      height: 40,
      component: CustomNode,
      data: {
        name: 'Me',
        gender: 'female',
      }
    });

    // Panning and dragging

    g.on('node:mousedown', ({ e, node }) => {
      console.log("mousedown")
      isDragging = true;
      draggingNode = node;
      startPosition = { x: e.clientX, y: e.clientY };
    });

    g.on('node:mousemove', ({ e }) => {
      console.log("mousemove")
      if (isDragging && startPosition && draggingNode) {
        const dx = e.clientX - startPosition.x;
        const dy = e.clientY - startPosition.y;
        startPosition = { x: e.clientX, y: e.clientY };

        const position = draggingNode.position();
        draggingNode.position(position.x + dx, position.y + dy);
      }
    });

    g.on('node:mouseup', () => {
      console.log("mouseup")
      isDragging = false; 
      draggingNode = null;
      startPosition = null;
    });
    g.on('blank:click', () => {
      g.getNodes().forEach((n) => {
        const data = n.getData();
        n.setData({...data,selected: false });

      });

    });

    g.on('blank:mousedown', ({ e }) => {
      if (e.button === 0) {
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
        const currentTranslate = g.translate();
        initialTranslate = { x: currentTranslate.tx, y: currentTranslate.ty };
      }
    });

    g.on('blank:mousemove', ({ e }) => {
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;
      g.translate(initialTranslate.x + dx, initialTranslate.y + dy);
    });

    g.on('blank:mouseup', () => {
      isPanning = false;
      startPoint = null;
    });

    g.on('node:button-plus:click', ({ node }) => {
      console.log('button-plus:click')
      setParentNode(node);
      setIsModalOpen(true);
    });

    g.on('node:button-minus:click', ({ node }) => {
      g.removeNode(node);
    });

    setGraph(g);
    g.fromJSON(sampleData);

    const handleOpenModal = () => setIsModalOpen(true);

    window.addEventListener('openFamilyTreeModal', handleOpenModal);

    {/*
    return () => {
      window.removeEventListener('openFamilyTreeModal', handleOpenModal);
    };
    */}
    const handleGraphChange = () => {
      if (g) {
        const data = g.toJSON();
        localStorage.setItem('familyTreeData', JSON.stringify(data));
        console.log('Graph saved to local storage');
      }
    };;

    g.on('node:added', handleGraphChange);
    g.on('node:removed', handleGraphChange);
    g.on('edge:added', handleGraphChange);
    g.on('edge:removed', handleGraphChange);
    g.on('node:change:position', handleGraphChange);
    g.on('node:change:data', handleGraphChange);

    const savedData = localStorage.getItem('familyTreeData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        g.fromJSON(data);
        console.log('Graph restored from localStorage');
      } catch (error) {
        console.error('Error loading graph:', error);
      }
    } else {
      g.fromJSON(sampleData); // Load default sample data if no saved data exists
    }

    handleZoomOut();
    g.centerContent();

    if (location.state?.openModal) {
      setIsModalOpen(true);
    }

    return () => {
      g.off();
    }
  }, []);

  useEffect(() => {
    if (!graph) return;

    graph.off('node:click');

    graph.on('node:click', ({ node }) => {
      console.log(isAddingEdge);
      if (isAddingEdge) {
        if (!firstSelectedNode) {
          console.log('first node set');
          console.log(node);
          setFirstSelectedNode(node);
        } else {
          graph.addEdge({
            source: node,
            target: firstSelectedNode,
            zIndex: 1,
          });
          setFirstSelectedNode(null);
          setIsAddingEdge(false);
        }
      } else {
        graph.getNodes().forEach((n) => {
          const data = n.getData();
          n.setData({...data,selected: false });
  
        });
        const data = node.getData();
        node.setData({...data,selected: true });
  
        setSelectedNode(node.getData());
      }
    });
  }, [graph, isAddingEdge, firstSelectedNode]);
  
  const addAncestorNode = (ancestorData) => {
    if (!graph) return;

    // Define a secluded spot (arbitrary values, adjust as needed)
    const secludedPosition = { x: 50, y: 50 };

    graph.addNode({
      shape: 'custom-react-node',
      x: secludedPosition.x,
      y: secludedPosition.y,
      width: 100,
      height: 40,
      data: ancestorData,
    });
  };
  const renameSelectedNode = () => {
    if (!selectedNode) return;
    setIsRenaming(true);
    setNewName(selectedNode.attr('label/text'));
  };

  const handleRename = () => {
    if (selectedNode && newName.trim()) {
      selectedNode.attr('label/text', newName);
      setIsRenaming(false);
    }
  };

  const handleZoomIn = () => {
    const zoom = graphRef.current.zoom();
    console.log(zoom)
    graphRef.current.zoomTo(zoom + 0.2);
  };
  
  const handleZoomOut = () => {
    const zoom = graphRef.current.zoom();
    console.log(zoom)
    graphRef.current.zoomTo(zoom - 0.2);
  };

  return (
    <section className="family-tree-section">
      <div className="family-tree-container-wrapper">

        <div id="container" className="family-tree-container">
        <div className="zoom-controls">
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handleZoomOut}>−</button>
          {/* <button onClick={toggleAddingEdge} className={isAddingEdge ? 'active' : ''}>
          {isAddingEdge ? 'Zrušiť' : 'Pridanie prepojenia medzi príbuznými'}
        </button> */}
        </div>
        {/* <button onClick={exportGraph}>Export graph</button> */}
          {/* <button
            onClick={() => {
              const jsonString = prompt('Insert json for import:');
              if (jsonString) {
                importGraph(jsonString);
              }
            }}
          >
            Import graph
          </button> */}
          {/* <button onClick={renameSelectedNode} disabled={!selectedNode}>Rename node</button>
          {isRenaming && (
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleRename}>Save</button>
            </div>
          )} */}
          <div ref={containerRef} />
        </div>
        <div className="node-info-panel">
            {selectedNode ? (
              <div>
                <h2>Informácie o členovi stromu</h2>
                <p><strong>Meno:</strong> {selectedNode.name}</p>
                {selectedNode.surname && <p><strong>Priezvisko:</strong> {selectedNode.surname}</p>}
                {selectedNode.job && <p><strong>Práca:</strong> {selectedNode.job}</p>}               
               
              </div>
            ) : (
              <p>Dvojklikom na člena stromu zobrazíte jeho informácie</p>
            )}
          </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AncestorSearch   onSelect={addNode}/>
      </Modal>

      <Modal isOpen={isHelperModalOpen} onClose={() => setHelperModalOpen(false)}>
        <div>
          <h2>Teraz dvakrát kliknite na predka, aby ste ho prepojili s dieťaťom.</h2>
        </div>
      </Modal>
      
      
    </section>
  );
};

export default FamilyTree;