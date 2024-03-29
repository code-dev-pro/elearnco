import usePageStore from "../usePageStore";
import { renderHook, act } from "@testing-library/react-hooks";
test("add / delete block", () => {
  const { result } = renderHook(() => usePageStore());

  act(() => {
    result.current.addBlock(0, "TITLE");
  });

  expect(result.current.blocks).toHaveLength(1);
  expect(result.current.addedBlocks).toHaveLength(1);
  expect(result.current.blocks[0].index).toBe(0);
  expect(result.current.blocks[0].type).toBe("TITLE");

  act(() => {
    result.current.addBlock(1, "VIDEO");
    result.current.addBlock(2, "EXAMPLE");
  });

  expect(result.current.blocks).toHaveLength(3);
  expect(result.current.addedBlocks).toHaveLength(3);
  expect(result.current.updatedBlocks).toHaveLength(0);

   // -- blocks          -- addedBlocks       -- updatedBlocks     -- deletedBlocks 
  //  -- TITLE - 0      //  -- TITLE - 0  
  //  -- VIDEO - 1      //  -- VIDEO - 1
  //  -- EXAMPLE - 2    //  -- EXAMPLE - 2

  act(() => {
    result.current.addBlock(1, "SUBTITLE");
  });

  expect(result.current.blocks).toHaveLength(4);
  expect(result.current.addedBlocks).toHaveLength(2);
  expect(result.current.addedBlocks[1].type).toBe("SUBTITLE");
  expect(result.current.addedBlocks[1].index).toBe(1);
  expect(result.current.updatedBlocks).toHaveLength(2);
  expect(result.current.updatedBlocks[0].type).toBe("VIDEO");
  expect(result.current.updatedBlocks[0].index).toBe(2);
  expect(result.current.updatedBlocks[1].type).toBe("EXAMPLE");
  expect(result.current.updatedBlocks[1].index).toBe(3);
  // -- blocks                    -- addedBlocks          -- updatedBlocks        -- deletedBlocks 
  //  -- TITLE - 0                  //  -- TITLE - 0       // -- VIDEO -2
  //  -- (VIDEO) SUBTITLE* - 1      // -- SUBTITLE - 1     // -- TITLE -3
  //  -- VIDEO - 2                  
  //  -- EXAMPLE - 3                  


  act(() => {
    result.current.removeBlock(result.current.blocks[1].uuid);
  });
  expect(result.current.blocks).toHaveLength(3);
  expect(result.current.deletedBlocks).toHaveLength(1);
  expect(result.current.deletedBlocks[0].type).toBe("SUBTITLE");
  expect(result.current.addedBlocks).toHaveLength(1);
  expect(result.current.updatedBlocks).toHaveLength(2);
  expect(result.current.updatedBlocks[0].type).toBe("VIDEO");
  expect(result.current.updatedBlocks[1].type).toBe("EXAMPLE");
  expect(result.current.blocks[1].type).toBe("VIDEO");
  expect(result.current.blocks[2].type).toBe("EXAMPLE");
  expect(result.current.blocks[1].index).toBe(1);
  expect(result.current.blocks[2].index).toBe(2);
  expect(result.current.updatedBlocks[0].index).toBe(1);
  expect(result.current.updatedBlocks[1].index).toBe(2);


  // -- blocks                    -- addedBlocks          -- updatedBlocks        -- deletedBlocks 
  //  -- TITLE - 0                 //  -- TITLE - 0        // -- VIDEO - 1          // --SUBTITLE* - 1
  //  -- VIDEO - 1                                         // -- EXAMPLE - 2
  //  -- EXAMPLE - 2  
  
  
  act(() => {
    result.current.duplicateBlock(result.current.blocks[0].uuid);// DUPLICATE BLOCK TITLE AT INDEX 0
  });

  expect(result.current.blocks).toHaveLength(4);
  expect(result.current.addedBlocks).toHaveLength(2);
  expect(result.current.updatedBlocks).toHaveLength(2);
  expect(result.current.deletedBlocks).toHaveLength(1);
  expect(result.current.blocks[1].type).toBe("TITLE");
  expect(result.current.blocks[1].index).toBe(1);
  expect(result.current.blocks[2].type).toBe("VIDEO");
  expect(result.current.blocks[2].index).toBe(2);
  expect(result.current.blocks[3].type).toBe("EXAMPLE");
  expect(result.current.blocks[3].index).toBe(3);

  expect(result.current.addedBlocks[0].type).toBe("TITLE");
  expect(result.current.addedBlocks[0].index).toBe(0);
  expect(result.current.addedBlocks[1].type).toBe("TITLE");
  expect(result.current.addedBlocks[1].index).toBe(1);

  expect(result.current.updatedBlocks[0].type).toBe("VIDEO");
  expect(result.current.updatedBlocks[0].index).toBe(2);
  expect(result.current.updatedBlocks[1].type).toBe("EXAMPLE");
  expect(result.current.updatedBlocks[1].index).toBe(3);
  // -- blocks                    -- addedBlocks          -- updatedBlocks        -- deletedBlocks 
  //  -- TITLE - 0                 //  -- TITLE - 0        // -- VIDEO - 2          // --SUBTITLE* - 1
  //  -- TITLE* - 1                //  -- TITLE - 1        // -- EXAMPLE - 3
  //  -- VIDEO* - 2
  //  -- EXAMPLE - 3 

});
