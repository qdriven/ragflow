import { useSetModalState } from '@/hooks/commonHooks';
import { useFetchFlow, useSetFlow } from '@/hooks/flow-hooks';
import { useFetchLlmList } from '@/hooks/llmHooks';
import { IGraph } from '@/interfaces/database/flow';
import { useIsFetching } from '@tanstack/react-query';
import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Connection, Node, Position, ReactFlowInstance } from 'reactflow';
// import { shallow } from 'zustand/shallow';
import { variableEnabledFieldMap } from '@/constants/chat';
import {
  ModelVariableType,
  settledModelVariableMap,
} from '@/constants/knowledge';
import { Variable } from '@/interfaces/database/chat';
import { useDebounceEffect } from 'ahooks';
import { FormInstance, message } from 'antd';
import { humanId } from 'human-id';
import trim from 'lodash/trim';
import { useParams } from 'umi';
import { NodeMap, Operator, RestrictedUpstreamMap } from './constant';
import useGraphStore, { RFState } from './store';
import { buildDslComponentsByGraph } from './utils';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  onSelectionChange: state.onSelectionChange,
});

export const useSelectCanvasData = () => {
  // return useStore(useShallow(selector)); // throw error
  // return useStore(selector, shallow);
  return useGraphStore(selector);
};

export const useHandleDrag = () => {
  const handleDragStart = useCallback(
    (operatorId: string) => (ev: React.DragEvent<HTMLDivElement>) => {
      ev.dataTransfer.setData('application/reactflow', operatorId);
      ev.dataTransfer.effectAllowed = 'move';
    },
    [],
  );

  return { handleDragStart };
};

export const useHandleDrop = () => {
  const addNode = useGraphStore((state) => state.addNode);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<any, any>>();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${type}:${humanId()}`,
        type: NodeMap[type as Operator] || 'ragNode',
        position: position || {
          x: 0,
          y: 0,
        },
        data: {
          label: `${type}`,
          name: humanId(),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode],
  );

  return { onDrop, onDragOver, setReactFlowInstance };
};

export const useShowDrawer = () => {
  const {
    clickedNodeId: clickNodeId,
    setClickedNodeId,
    getNode,
  } = useGraphStore((state) => state);
  const {
    visible: drawerVisible,
    hideModal: hideDrawer,
    showModal: showDrawer,
  } = useSetModalState();

  const handleShow = useCallback(
    (node: Node) => {
      setClickedNodeId(node.id);
      showDrawer();
    },
    [showDrawer, setClickedNodeId],
  );

  return {
    drawerVisible,
    hideDrawer,
    showDrawer: handleShow,
    clickedNode: getNode(clickNodeId),
  };
};

export const useHandleKeyUp = () => {
  const deleteEdge = useGraphStore((state) => state.deleteEdge);
  const handleKeyUp: KeyboardEventHandler = useCallback(
    (e) => {
      if (e.code === 'Delete') {
        deleteEdge();
      }
    },
    [deleteEdge],
  );

  return { handleKeyUp };
};

export const useSaveGraph = () => {
  const { data } = useFetchFlow();
  const { setFlow } = useSetFlow();
  const { id } = useParams();
  const { nodes, edges } = useGraphStore((state) => state);
  const saveGraph = useCallback(() => {
    const dslComponents = buildDslComponentsByGraph(nodes, edges);
    setFlow({
      id,
      title: data.title,
      dsl: { ...data.dsl, graph: { nodes, edges }, components: dslComponents },
    });
  }, [nodes, edges, setFlow, id, data]);

  return { saveGraph };
};

export const useWatchGraphChange = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  useDebounceEffect(
    () => {
      // console.info('useDebounceEffect');
    },
    [nodes, edges],
    {
      wait: 1000,
    },
  );
};

export const useHandleFormValuesChange = (id?: string) => {
  const updateNodeForm = useGraphStore((state) => state.updateNodeForm);
  const handleValuesChange = useCallback(
    (changedValues: any, values: any) => {
      if (id) {
        updateNodeForm(id, values);
      }
    },
    [updateNodeForm, id],
  );

  return { handleValuesChange };
};

const useSetGraphInfo = () => {
  const { setEdges, setNodes } = useGraphStore((state) => state);
  const setGraphInfo = useCallback(
    ({ nodes = [], edges = [] }: IGraph) => {
      if (nodes.length || edges.length) {
        setNodes(nodes);
        setEdges(edges);
      }
    },
    [setEdges, setNodes],
  );
  return setGraphInfo;
};

export const useFetchDataOnMount = () => {
  const { loading, data } = useFetchFlow();
  const setGraphInfo = useSetGraphInfo();

  useEffect(() => {
    setGraphInfo(data?.dsl?.graph ?? ({} as IGraph));
  }, [setGraphInfo, data?.dsl?.graph]);

  useWatchGraphChange();

  useFetchLlmList();

  return { loading, flowDetail: data };
};

export const useFlowIsFetching = () => {
  return useIsFetching({ queryKey: ['flowDetail'] }) > 0;
};

export const useSetLlmSetting = (form?: FormInstance) => {
  const initialLlmSetting = undefined;

  useEffect(() => {
    const switchBoxValues = Object.keys(variableEnabledFieldMap).reduce<
      Record<string, boolean>
    >((pre, field) => {
      pre[field] =
        initialLlmSetting === undefined
          ? true
          : !!initialLlmSetting[
              variableEnabledFieldMap[
                field as keyof typeof variableEnabledFieldMap
              ] as keyof Variable
            ];
      return pre;
    }, {});
    const otherValues = settledModelVariableMap[ModelVariableType.Precise];
    form?.setFieldsValue({ ...switchBoxValues, ...otherValues });
  }, [form, initialLlmSetting]);
};

export const useValidateConnection = () => {
  const { edges, getOperatorTypeFromId } = useGraphStore((state) => state);
  // restricted lines cannot be connected successfully.
  const isValidConnection = useCallback(
    (connection: Connection) => {
      // limit there to be only one line between two nodes
      const hasLine = edges.some(
        (x) => x.source === connection.source && x.target === connection.target,
      );

      const ret =
        !hasLine &&
        RestrictedUpstreamMap[
          getOperatorTypeFromId(connection.source) as Operator
        ]?.every((x) => x !== getOperatorTypeFromId(connection.target));
      return ret;
    },
    [edges, getOperatorTypeFromId],
  );

  return isValidConnection;
};

export const useHandleNodeNameChange = (node?: Node) => {
  const [name, setName] = useState<string>('');
  const { updateNodeName, nodes } = useGraphStore((state) => state);
  const previousName = node?.data.name;
  const id = node?.id;

  const handleNameBlur = useCallback(() => {
    const existsSameName = nodes.some((x) => x.data.name === name);
    if (trim(name) === '' || existsSameName) {
      if (existsSameName && previousName !== name) {
        message.error('The name cannot be repeated');
      }
      setName(previousName);
      return;
    }

    if (id) {
      updateNodeName(id, name);
    }
  }, [name, id, updateNodeName, previousName, nodes]);

  const handleNameChange = useCallback((e: ChangeEvent<any>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    setName(previousName);
  }, [previousName]);

  return { name, handleNameBlur, handleNameChange };
};
