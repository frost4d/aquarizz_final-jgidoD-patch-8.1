import {
    Popover,
    PopoverTrigger,
    PopoverBody,
    PopoverFooter,
    PopoverContent,
    Portal,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    Button
  } from '@chakra-ui/react'


  const ShareModal = (props) => {

    return(
        <>
        <Popover>
        <PopoverTrigger>
          <Button>Trigger</Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>Header</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <Button colorScheme='blue'>Button</Button>
            </PopoverBody>
            <PopoverFooter>This is the footer</PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
        </>
    )
  }

  export default ShareModal