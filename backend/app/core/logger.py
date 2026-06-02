import logging
import sys

def setup_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # Avoid adding multiple handlers if setup is called more than once
    if not logger.hasHandlers():
        logger.addHandler(console_handler)
        
    return logger

logger = setup_logger()
