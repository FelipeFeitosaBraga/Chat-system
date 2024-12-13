namespace back_end.Model
{
    public class Message
    {
        public required string Para { get; set; }
        public required string De { get; set; }
        public required string Texto { get; set; }
        public DateTime Data { get; set; } = DateTime.Now;
    }
}
