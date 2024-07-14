from fpdf import FPDF

# Define a function to process the text and convert it to a PDF
def text_to_pdf(text_file_path, output_pdf_path):
    # Create a PDF object
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Set font for headings and regular text
    heading_font_size = 16
    bold_font_size = 12
    normal_font_size = 12
    
    # Open and read the text file
    with open(text_file_path, 'r') as file:
        lines = file.readlines()
    
    y = 10  # Y coordinate for text
    pdf.set_xy(10, y)
    
    for line in lines:
        line = line.rstrip()  # Remove trailing whitespace and newline
        
        if line.startswith('## '):
            # Heading format
            pdf.set_font('Helvetica', 'B', heading_font_size)
            line = line.replace('## ', '')  # Remove '## ' markers
        elif line.startswith('') and line.endswith(''):
            # Bold format
            pdf.set_font('Helvetica', 'B', bold_font_size)
            line = line.replace('', '')  # Remove '' markers
        else:
            # Normal text format
            pdf.set_font('Helvetica', '', normal_font_size)
        
        pdf.multi_cell(0, 10, line)  # Use multi_cell to handle long text
        y += 10
        
        # Adding a new page if text goes beyond the page
        if y > 280:
            pdf.add_page()
            y = 10
            pdf.set_xy(10, y)
    
    # Save the PDF
    pdf.output(output_pdf_path)

# # Define paths
# text_file_path = 'transcription.txt'  # Replace with your text file path
# output_pdf_path = 'output.pdf'  # Output PDF path

# # Convert text file to PDF
# text_to_pdf(text_file_path, output_pdf_path)