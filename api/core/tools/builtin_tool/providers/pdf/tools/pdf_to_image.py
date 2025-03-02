import logging
import mimetypes
from collections.abc import Generator
from typing import Any, Optional

from core.file.enums import FileType
from core.tools.builtin_tool.tool import BuiltinTool
from core.tools.entities.tool_entities import ToolInvokeMessage

logger = logging.getLogger(__name__)


class PdfToImageTool(BuiltinTool):
    def _invoke(
            self,
            user_id: str,
            tool_parameters: dict[str, Any],
            conversation_id: Optional[str] = None,
            app_id: Optional[str] = None,
            message_id: Optional[str] = None,
    ) -> Generator[ToolInvokeMessage, None, None]:
        file = tool_parameters.get("pdf_file")
        mimetype = mimetypes.guess_type("123.pdf")
        logger.info("file {} type is {} mime type is {}".format(file, file.type, file.mime_type))
        if file.type != FileType.IMAGE:  # type: ignore
            yield self.create_text_message("not a valid image file")
            return
